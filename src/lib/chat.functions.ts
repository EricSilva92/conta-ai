import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SYSTEM = `Você é a Conta AI, assistente de psicologia financeira criada por Viviane Pereira (psicóloga e economista).
Fale em português do Brasil, de forma acolhedora, curta (até 4 frases) e sem julgamentos.
Ajude a pessoa a entender as emoções por trás das decisões financeiras e proponha um próximo passo simples.
Não dê recomendações de investimento específicas. Em sinais de crise emocional, sugira o CVV (188) e ajuda profissional.`;

async function generateReply(history: { role: "user" | "assistant"; content: string }[]) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Assistente indisponível no momento.");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: "openai/gpt-6-astra",
      instructions: SYSTEM,
      input: history.map((m) => ({ role: m.role, content: m.content })),
      reasoning: { effort: "low" },
      store: false,
      stream: true,
    }),
  });
  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    console.error(`AI gateway failed [${res.status}]: ${body}`);
    if (res.status === 429) throw new Error("Muitas mensagens agora. Tente novamente em instantes.");
    if (res.status === 402) throw new Error("Créditos de IA esgotados.");
    throw new Error("A assistente não conseguiu responder agora.");
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload);
        if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") text += evt.delta;
      } catch {
        /* partial */
      }
    }
  }
  return text.trim();
}

export const sendClientMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { content: string }) => {
    const content = String(input?.content ?? "").trim();
    if (!content || content.length > 2000) throw new Error("Mensagem inválida.");
    return { content };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("messages").insert({ client_id: userId, sender: "client", content: data.content });
    if (error) throw new Error(error.message);
    await supabase.from("profiles").update({ last_seen_at: new Date().toISOString() }).eq("id", userId);

    const { data: profile } = await supabase.from("profiles").select("ai_enabled").eq("id", userId).single();
    if (!profile?.ai_enabled) return { replied: false };

    const { data: msgs } = await supabase
      .from("messages")
      .select("sender, content")
      .eq("client_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    const history = (msgs ?? []).reverse().map((m) => ({
      role: (m.sender === "client" ? "user" : "assistant") as "user" | "assistant",
      content: m.content,
    }));
    const reply = await generateReply(history);
    if (!reply) return { replied: false };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("messages").insert({ client_id: userId, sender: "ai", content: reply });
    return { replied: true };
  });
