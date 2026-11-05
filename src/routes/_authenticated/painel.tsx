import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, Users, Psi, Settings, Search, SquarePen, MoreHorizontal, LogOut } from "@/components/chat/icons";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/components/site/Brand";
import { Timeline } from "@/components/chat/Timeline";
import { Composer } from "@/components/chat/Composer";
import { useMessages } from "@/components/chat/useMessages";
import { isAdmin, initials, timeAgo } from "@/lib/auth-helpers";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({ meta: [{ title: "Painel — Conta AI" }, { name: "description", content: "Painel administrativo do Conta AI." }] }),
  component: Painel,
});

type Profile = { id: string; full_name: string; email: string | null; ai_enabled: boolean; stress_level: number; last_seen_at: string };

function stressLabel(n: number) {
  if (n < 30) return "Baixo";
  if (n < 55) return "Médio";
  if (n < 75) return "Médio-Alto";
  return "Alto";
}

function Painel() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [clients, setClients] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const messages = useMessages(selected);

  useEffect(() => {
    isAdmin(user.id).then((a) => {
      if (!a) navigate({ to: "/minha-conta" });
      setAllowed(a);
    });
  }, [user.id, navigate]);

  async function loadClients() {
    const { data } = await supabase.from("profiles").select("*").neq("id", user.id).order("last_seen_at", { ascending: false });
    setClients(data ?? []);
    setSelected((s) => s ?? data?.[0]?.id ?? null);
  }

  useEffect(() => {
    if (!allowed) return;
    loadClients();
    const ch = supabase
      .channel(`profiles-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => loadClients())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed]);

  const filtered = useMemo(() => clients.filter((c) => c.full_name.toLowerCase().includes(q.toLowerCase())), [clients, q]);
  const current = clients.find((c) => c.id === selected);

  async function toggleControl() {
    if (!current) return;
    const { error } = await supabase.from("profiles").update({ ai_enabled: !current.ai_enabled }).eq("id", current.id);
    if (error) return toast.error("Não foi possível alterar o modo de atendimento.");
    setClients((cs) => cs.map((c) => (c.id === current.id ? { ...c, ai_enabled: !c.ai_enabled } : c)));
    toast.success(current.ai_enabled ? "Você assumiu o atendimento." : "A IA voltou a atender.");
  }

  async function adminSend(t: string) {
    if (!current) return;
    const { error } = await supabase.from("messages").insert({ client_id: current.id, sender: "admin", content: t });
    if (error) toast.error("Erro ao enviar.");
  }

  async function logout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (!allowed) return null;
  const online = (iso: string) => Date.now() - new Date(iso).getTime() < 10 * 60 * 1000;

  return (
    <div className="grid h-screen grid-cols-[300px_340px_1fr] gap-6 p-6">
      {/* Sidebar */}
      <aside className="card-panel flex flex-col p-5">
        <div className="px-2 pb-10 pt-2"><Brand /></div>
        <nav className="space-y-1.5 text-[17px] text-ink">
          <NavItem icon={LayoutGrid} label="Dashboard" />
          <NavItem icon={Users} label="Clientes" active />
          <NavItem icon={Psi} label="Psicologia Financeira" />
          <NavItem icon={Settings} label="Configurações" />
        </nav>
        <div className="mt-auto space-y-3">
          <button
            onClick={toggleControl}
            disabled={!current}
            className="h-14 w-full rounded-full bg-primary text-lg font-medium text-primary-foreground shadow-lg transition hover:opacity-90 disabled:opacity-50"
          >
            {current && !current.ai_enabled ? "Devolver à IA" : "Assumir Controle"}
          </button>
          <button onClick={logout} className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      <div className="col-span-2 grid min-h-0 grid-rows-[auto_1fr] gap-6">
        {/* Top bar */}
        <header className="card-panel flex items-center justify-between px-6 py-4">
          <label className="flex h-12 w-96 items-center gap-3 rounded-xl border border-input px-4 text-muted-foreground">
            <Search className="h-5 w-5" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." className="flex-1 bg-transparent text-[16px] text-foreground outline-none placeholder:text-muted-foreground" />
          </label>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 rounded-xl border border-success/30 bg-success-soft px-4 py-2 text-success">
              <span className="h-2.5 w-2.5 rounded-full bg-success" /> Conexão Ativa
            </span>
            <span className="rounded-xl border border-primary/20 bg-secondary px-4 py-2 text-ink">Psicologia Financeira: Sim</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">
              {initials((user.user_metadata?.full_name as string) || user.email || "Admin")}
            </span>
          </div>
        </header>

        <div className="grid min-h-0 grid-cols-[340px_1fr] gap-6">
          {/* Clients */}
          <section className="card-panel flex min-h-0 flex-col p-4">
            <h2 className="px-3 pt-3 text-3xl font-bold text-ink">Clientes</h2>
            <p className="px-3 pb-3 pt-3 text-muted-foreground">Status clientes</p>
            <div className="space-y-1 overflow-y-auto">
              {filtered.length === 0 && <p className="px-3 text-sm text-muted-foreground">Nenhum cliente ainda.</p>}
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border-2 border-transparent p-3 text-left transition",
                    c.id === selected ? "border-primary/60 bg-secondary" : "hover:bg-muted",
                  )}
                >
                  <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-primary">
                    {initials(c.full_name)}
                    {online(c.last_seen_at) && <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-card bg-success" />}
                  </span>
                  <span>
                    <span className="block text-lg text-ink">{c.full_name}</span>
                    <span className="text-muted-foreground">
                      <span className={online(c.last_seen_at) ? "text-success" : ""}>{online(c.last_seen_at) ? "Online" : "Offline"}</span> - {timeAgo(c.last_seen_at)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Conversation */}
          <section className="card-panel relative flex min-h-0 flex-col">
            {current ? (
              <>
                <div className="flex items-start justify-between px-7 pb-4 pt-6">
                  <div>
                    <h2 className="text-3xl font-bold text-ink">Atendimento: {current.full_name}</h2>
                    <span className="mt-2 inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1 text-ink">
                      <span className={cn("h-2.5 w-2.5 rounded-full", current.ai_enabled ? "bg-success" : "bg-brand-orange")} />
                      {current.ai_enabled ? "Atendimento por IA" : "Atendimento humano"}
                    </span>
                  </div>
                  <div className="flex gap-4 text-muted-foreground">
                    <SquarePen className="h-6 w-6" />
                    <MoreHorizontal className="h-6 w-6" />
                  </div>
                </div>
                <div className="absolute right-7 top-36 z-10 w-72 rounded-2xl border border-border bg-card p-5 shadow-xl">
                  <p className="text-xl font-semibold text-ink">Indicador de Estresse</p>
                  <p className="mt-1 text-ink">Nível: {stressLabel(current.stress_level)}</p>
                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-brand-orange/20">
                    <div className="h-full rounded-full bg-gradient-stress" style={{ width: `${current.stress_level}%` }} />
                  </div>
                </div>
                <div className="flex min-h-0 flex-1 flex-col border-t border-border pr-80">
                  <Timeline messages={messages} clientName={current.full_name} />
                </div>
                <Composer
                  onSend={adminSend}
                  placeholder={current.ai_enabled ? "Assuma o controle para responder ou envie uma nota..." : "Digite uma mensagem..."}
                />
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-muted-foreground">Selecione um cliente</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active }: { icon: React.ComponentType<{ className?: string }>; label: string; active?: boolean }) {
  return (
    <div className={cn("flex items-center gap-4 rounded-xl px-4 py-3.5", active ? "bg-secondary" : "hover:bg-muted")}>
      <Icon className="h-6 w-6" /> {label}
    </div>
  );
}
