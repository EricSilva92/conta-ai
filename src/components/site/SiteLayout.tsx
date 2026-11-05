import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Brand } from "./Brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-card/85 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Brand />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link to="/" className="hover:text-foreground" activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }}>Início</Link>
          <Link to="/sobre" className="hover:text-foreground" activeProps={{ className: "text-foreground" }}>Sobre</Link>
          <Link to="/como-funciona" className="hover:text-foreground" activeProps={{ className: "text-foreground" }}>Como funciona</Link>
        </nav>
        <Button asChild className="rounded-full px-6">
          <Link to="/auth">Entrar</Link>
        </Button>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Brand size="sm" />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Psicologia financeira para decisões inteligentes. Criado por Viviane Pereira, psicóloga e economista.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Conta AI</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/sobre" className="hover:text-foreground">Sobre</Link></li>
            <li><Link to="/como-funciona" className="hover:text-foreground">Como funciona</Link></li>
            <li><Link to="/auth" className="hover:text-foreground">Entrar / Criar conta</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Legal</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacidade" className="hover:text-foreground">Política de Privacidade</Link></li>
            <li><Link to="/termos" className="hover:text-foreground">Termos de Uso</Link></li>
            <li><Link to="/cookies" className="hover:text-foreground">Política de Cookies</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Conta AI. Todos os direitos reservados.</span>
          <span>Feito com cuidado para pessoas e pequenas empresas.</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-primary">Documento legal</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Última atualização: {updated}</p>
        <div className="card-panel mt-10 space-y-6 p-8 text-[15px] leading-relaxed text-foreground/85 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1">
          {children}
        </div>
      </article>
    </SiteShell>
  );
}
