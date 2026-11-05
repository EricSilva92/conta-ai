import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/components/site/Brand";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/chat/Timeline";
import { Composer } from "@/components/chat/Composer";
import { useMessages } from "@/components/chat/useMessages";
import { sendClientMessage } from "@/lib/chat.functions";
import { isAdmin } from "@/lib/auth-helpers";

export const Route = createFileRoute("/_authenticated/minha-conta")({
  head: () => ({ meta: [{ title: "Meu atendimento — Conta AI" }, { name: "description", content: "Converse com a assistente Conta AI." }] }),
  component: MinhaConta,
});

function MinhaConta() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const send = useServerFn(sendClientMessage);
  const messages = useMessages(user.id);
  const [name, setName] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    isAdmin(user.id).then((a) => a && navigate({ to: "/painel" }));
    supabase.from("profiles").select("full_name").eq("id", user.id).single().then(({ data }) => setName(data?.full_name ?? ""));
  }, [user.id, navigate]);

  async function logout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto flex h-screen max-w-4xl flex-col gap-5 p-5">
      <header className="card-panel flex items-center justify-between px-6 py-4">
        <Brand size="sm" />
        <Button variant="ghost" onClick={logout}><LogOut className="mr-2 h-4 w-4" /> Sair</Button>
      </header>
      <section className="card-panel flex min-h-0 flex-1 flex-col">
        <div className="border-b border-border px-7 py-5">
          <h1 className="text-2xl font-bold text-ink">Olá{name ? `, ${name.split(" ")[0]}` : ""}!</h1>
          <p className="text-sm text-muted-foreground">Conte como está sua relação com o dinheiro hoje.</p>
        </div>
        <Timeline messages={messages} clientName={name || "Você"} typing={typing} />
        <Composer
          disabled={typing}
          onSend={async (t) => {
            setTyping(true);
            try {
              await send({ data: { content: t } });
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Erro ao enviar.");
            } finally {
              setTyping(false);
            }
          }}
        />
      </section>
    </div>
  );
}
