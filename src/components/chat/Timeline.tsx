import { useEffect, useRef } from "react";
import { logoIconUrl } from "@/components/site/Brand";
import { initials } from "@/lib/auth-helpers";
import type { Msg } from "./useMessages";

export function Timeline({ messages, clientName, typing }: { messages: Msg[]; clientName: string; typing?: boolean }) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, typing]);
  return (
    <div className="flex-1 space-y-6 overflow-y-auto px-7 py-5">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> Timeline <div className="h-px flex-1 bg-border" />
      </div>
      {messages.length === 0 && <p className="text-center text-sm text-muted-foreground">Nenhuma mensagem ainda.</p>}
      {messages.map((m) =>
        m.sender === "client" ? (
          <div key={m.id} className="flex flex-col items-end">
            <div className="mb-2 flex items-center gap-2 font-semibold text-ink">
              {clientName}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">{initials(clientName)}</span>
            </div>
            <div className="max-w-[75%] whitespace-pre-wrap rounded-2xl border-2 border-ink bg-card px-5 py-3 text-[15px] text-ink">{m.content}</div>
          </div>
        ) : (
          <div key={m.id}>
            <div className="mb-2 flex items-center gap-2 font-semibold text-ink">
              {m.sender === "ai" ? (
                <>
                  <img src={logoIconUrl} alt="" className="h-8 w-8 object-contain mix-blend-multiply" /> Conta Ai (IA)
                </>
              ) : (
                <>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">VP</span> Viviane (Especialista)
                </>
              )}
            </div>
            <div className="ml-10 max-w-[75%] whitespace-pre-wrap rounded-2xl bg-bubble px-5 py-3 text-[15px] text-ink">{m.content}</div>
          </div>
        ),
      )}
      {typing && <p className="ml-10 text-sm text-muted-foreground">Conta Ai está digitando…</p>}
      <div ref={end} />
    </div>
  );
}
