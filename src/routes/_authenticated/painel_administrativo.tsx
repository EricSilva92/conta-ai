import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, Users, Search, LogOut } from "@/components/chat/icons";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/components/site/Brand";
import { Timeline } from "@/components/chat/Timeline";
import { Composer } from "@/components/chat/Composer";
import { useMessages } from "@/components/chat/useMessages";
import { isAdmin, initials, timeAgo } from "@/lib/auth-helpers";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/painel_administrativo")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — Conta AI" },
      { name: "description", content: "Painel administrativo do Conta AI." },
      { property: "og:title", content: "Painel administrativo — Conta AI" },
      { property: "og:description", content: "Acompanhe atendimentos e usuários do Conta AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Painel,
});

type Profile = {
  id: string;
  full_name: string;
  email: string | null;
  ai_enabled: boolean;
  last_seen_at: string;
  created_at: string;
};

function isRecentlyActive(iso: string) {
  return Date.now() - new Date(iso).getTime() < 10 * 60 * 1000;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso),
  );
}

function Painel() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [clients, setClients] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [profileDetail, setProfileDetail] = useState<Profile | null>(null);
  const messages = useMessages(selected);

  useEffect(() => {
    let active = true;
    isAdmin(user.id)
      .then((a) => {
        if (!active) return;
        if (!a) {
          navigate({ to: "/minha-conta" });
          return;
        }
        setAllowed(true);
      })
      .catch(() => {
        if (!active) return;
        toast.error("Não foi possível verificar seu acesso administrativo.");
        navigate({ to: "/auth" });
      });
    return () => {
      active = false;
    };
  }, [user.id, navigate]);

  async function loadClients() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, ai_enabled, last_seen_at, created_at")
      .neq("id", user.id)
      .order("last_seen_at", { ascending: false });
    if (error) {
      toast.error("Não foi possível carregar os usuários.");
      return;
    }
    setClients(data ?? []);
    setSelected((s) => s ?? data?.[0]?.id ?? null);
  }

  useEffect(() => {
    if (!allowed) return undefined;
    loadClients();
    const ch = supabase
      .channel(`profiles-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () =>
        loadClients(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed]);

  const filtered = useMemo(
    () => clients.filter((c) => c.full_name.toLowerCase().includes(q.toLowerCase())),
    [clients, q],
  );
  const current = clients.find((c) => c.id === selected);

  async function toggleControl() {
    if (!current) return;
    const { error } = await supabase
      .from("profiles")
      .update({ ai_enabled: !current.ai_enabled })
      .eq("id", current.id);
    if (error) {
      toast.error("Não foi possível alterar o modo de atendimento.");
      return;
    }
    setClients((cs) =>
      cs.map((c) => (c.id === current.id ? { ...c, ai_enabled: !c.ai_enabled } : c)),
    );
    toast.success(current.ai_enabled ? "Você assumiu o atendimento." : "A IA voltou a atender.");
  }

  async function adminSend(t: string) {
    if (!current) return;
    const { error } = await supabase
      .from("messages")
      .insert({ client_id: current.id, sender: "admin", content: t });
    if (error) toast.error("Não foi possível enviar a mensagem.");
  }

  async function logout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (!allowed) return null;
  const recentlyActive = clients.filter((c) => isRecentlyActive(c.last_seen_at)).length;
  const aiEnabled = clients.filter((c) => c.ai_enabled).length;
  const humanHandling = clients.length - aiEnabled;

  return (
    <div className="grid min-h-screen gap-4 p-4 xl:h-screen xl:grid-cols-[270px_minmax(0,1fr)] xl:gap-6 xl:p-6">
      <aside className="card-panel flex flex-col p-5">
        <div className="px-2 pb-6 pt-2">
          <Brand />
        </div>
        <nav className="space-y-1.5 text-[16px] text-ink">
          <NavItem href="#resumo" icon={LayoutGrid} label="Resumo" />
          <NavItem href="#clientes" icon={Users} label="Usuários" active />
        </nav>
        <div className="mt-6 space-y-3 xl:mt-auto">
          <button
            onClick={toggleControl}
            disabled={!current}
            className="h-12 w-full rounded-full bg-primary text-base font-medium text-primary-foreground shadow-lg transition hover:opacity-90 disabled:opacity-50"
          >
            {current && !current.ai_enabled ? "Devolver à IA" : "Assumir Controle"}
          </button>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      <main className="grid gap-4 xl:min-h-0 xl:grid-rows-[auto_auto_minmax(0,1fr)] xl:gap-6">
        <header className="card-panel flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <label className="flex h-12 w-full max-w-md items-center gap-3 rounded-xl border border-input px-4 text-muted-foreground">
            <Search className="h-5 w-5" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar..."
              className="flex-1 bg-transparent text-[16px] text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Equipe administrativa</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">
              {initials((user.user_metadata?.["full_name"] as string) || user.email || "Admin")}
            </span>
          </div>
        </header>

        <section id="resumo" className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          <MetricCard
            label="Usuários cadastrados"
            value={clients.length}
            detail="Contas de usuários"
          />
          <MetricCard
            label="Atividade recente"
            value={recentlyActive}
            detail="Ativos nos últimos 10 minutos"
          />
          <MetricCard label="Atendimento por IA" value={aiEnabled} detail="IA habilitada" />
          <MetricCard label="Atendimento humano" value={humanHandling} detail="IA pausada" />
        </section>

        <div className="grid min-h-[680px] gap-4 lg:grid-cols-[320px_minmax(0,1fr)] xl:min-h-0 xl:gap-6">
          <section id="clientes" className="card-panel flex min-h-0 flex-col p-4">
            <h2 className="px-3 pt-3 text-2xl font-bold text-ink">Usuários</h2>
            <p className="px-3 pb-3 pt-2 text-sm text-muted-foreground">
              Selecione uma conversa ou abra o perfil.
            </p>
            <div className="space-y-1 overflow-y-auto">
              {filtered.length === 0 && (
                <p className="px-3 text-sm text-muted-foreground">Nenhum usuário encontrado.</p>
              )}
              {filtered.map((c) => {
                const active = isRecentlyActive(c.last_seen_at);
                return (
                  <div
                    key={c.id}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border-2 border-transparent p-3 transition",
                      c.id === selected ? "border-primary/60 bg-secondary" : "hover:bg-muted",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setSelected(c.id)}
                      aria-label={`Abrir conversa com ${c.full_name}`}
                      className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-base font-bold text-primary"
                    >
                      {initials(c.full_name)}
                      {active && (
                        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card bg-success" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => setProfileDetail(c)}
                        className="block max-w-full truncate text-left font-semibold text-ink hover:text-primary"
                      >
                        {c.full_name}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelected(c.id)}
                        className="block text-left text-xs text-muted-foreground"
                      >
                        <span className={active ? "text-success" : ""}>
                          {active ? "Atividade recente" : "Última atividade"}
                        </span>
                        {" · "}
                        {timeAgo(c.last_seen_at)}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="card-panel flex min-h-0 flex-col">
            {current ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3 px-6 pb-4 pt-6">
                  <div>
                    <h2 className="text-2xl font-bold text-ink">
                      Atendimento: {current.full_name}
                    </h2>
                    <span className="mt-2 inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1 text-ink">
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          current.ai_enabled ? "bg-success" : "bg-brand-orange",
                        )}
                      />
                      {current.ai_enabled ? "Atendimento por IA" : "Atendimento humano"}
                    </span>
                  </div>
                </div>
                <div className="flex min-h-0 flex-1 flex-col border-t border-border">
                  <Timeline messages={messages} clientName={current.full_name} />
                </div>
                <Composer
                  onSend={adminSend}
                  disabled={current.ai_enabled}
                  placeholder={
                    current.ai_enabled
                      ? "Assuma o atendimento para responder"
                      : "Digite uma mensagem..."
                  }
                />
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-muted-foreground">
                Selecione um cliente
              </div>
            )}
          </section>
        </div>
      </main>
      <Dialog
        open={profileDetail !== null}
        onOpenChange={(open) => !open && setProfileDetail(null)}
      >
        <DialogContent>
          {profileDetail && (
            <>
              <DialogHeader>
                <DialogTitle>Informações do usuário</DialogTitle>
                <DialogDescription>
                  Dados cadastrais e situação atual do atendimento.
                </DialogDescription>
              </DialogHeader>
              <h3 className="text-xl font-semibold text-ink">{profileDetail.full_name}</h3>
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">E-mail</dt>
                  <dd className="mt-1 break-all font-medium text-ink">
                    {profileDetail.email || "Não informado"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Cadastro</dt>
                  <dd className="mt-1 font-medium text-ink">
                    {formatDate(profileDetail.created_at)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Última atividade</dt>
                  <dd className="mt-1 font-medium text-ink">
                    {formatDate(profileDetail.last_seen_at)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Atendimento</dt>
                  <dd className="mt-1 font-medium text-ink">
                    {profileDetail.ai_enabled ? "IA" : "Humano"}
                  </dd>
                </div>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="card-panel p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-4 rounded-xl px-4 py-3.5",
        active ? "bg-secondary" : "hover:bg-muted",
      )}
    >
      <Icon className="h-5 w-5" /> {label}
    </a>
  );
}
