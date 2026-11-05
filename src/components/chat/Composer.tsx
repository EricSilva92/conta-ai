import { useState } from "react";
import { SendHorizontal } from "lucide-react";

export function Composer({ onSend, disabled, placeholder = "Digite uma mensagem..." }: { onSend: (t: string) => Promise<void> | void; disabled?: boolean; placeholder?: string }) {
  const [text, setText] = useState("");
  return (
    <form
      className="border-t border-border p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const t = text.trim();
        if (!t) return;
        setText("");
        await onSend(t);
      }}
    >
      <div className="flex items-center rounded-2xl border border-input bg-card px-5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
        />
        <button type="submit" disabled={disabled} aria-label="Enviar" className="text-muted-foreground hover:text-primary disabled:opacity-40">
          <SendHorizontal className="h-6 w-6" />
        </button>
      </div>
    </form>
  );
}
