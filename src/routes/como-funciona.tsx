import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como funciona — Conta AI" },
      { name: "description", content: "Crie sua conta, converse com a assistente Conta AI e receba acompanhamento humano quando precisar." },
      { property: "og:title", content: "Como funciona o Conta AI" },
      { property: "og:description", content: "Três passos para uma relação mais leve com o dinheiro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Como,
});

const steps = [
  { n: "01", t: "Crie sua conta", d: "Cadastro rápido com e-mail ou Google." },
  { n: "02", t: "Converse com a Conta AI", d: "Conte o que está acontecendo com suas finanças. A assistente acolhe, pergunta e orienta." },
  { n: "03", t: "Acompanhamento especializado", d: "A especialista acompanha sua evolução e pode assumir a conversa a qualquer momento." },
];

function Como() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="font-display text-5xl font-bold text-ink">Como funciona</h1>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card-panel p-8">
              <span className="font-display text-4xl font-bold text-gradient-brand">{s.n}</span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
        <Button asChild size="lg" className="mt-12 rounded-full px-8">
          <Link to="/auth">Criar minha conta</Link>
        </Button>
      </section>
    </SiteShell>
  );
}
