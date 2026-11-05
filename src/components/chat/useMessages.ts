import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Msg = { id: string; client_id: string; sender: string; content: string; created_at: string };

export function useMessages(clientId: string | null) {
  const [messages, setMessages] = useState<Msg[]>([]);
  useEffect(() => {
    if (!clientId) return setMessages([]);
    let active = true;
    supabase
      .from("messages")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at")
      .then(({ data }) => active && setMessages(data ?? []));
    const ch = supabase
      .channel(`msgs-${clientId}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `client_id=eq.${clientId}` }, (p) => {
        const m = p.new as Msg;
        setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
      })
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(ch);
    };
  }, [clientId]);
  return messages;
}
