import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o Conta AI — Viviane Pereira" },
      { name: "description", content: "Conheça a história do Conta AI, criado pela psicóloga e economista Viviane Pereira." },
      { property: "og:title", content: "Sobre o Conta AI" },
      { property: "og:description", content: "Psicologia e economia juntas para decisões financeiras melhores." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-sm font-medium text-primary">Nossa história</p>
        <h1 className="mt-2 font-display text-5xl font-bold text-ink">Dinheiro também é emoção.</h1>
        <div className="mt-8 space-y-5 text-lg text-muted-foreground">
          <p>O Conta AI nasceu da experiência de Viviane Pereira, psicóloga e economista, que percebeu que a maioria das decisões financeiras não é tomada por planilhas — e sim por sentimentos como ansiedade, culpa, medo e impulso.</p>
          <p>Unindo os dois mundos, o Conta AI oferece um atendimento acolhedor, apoiado por inteligência artificial e supervisionado por uma especialista, para ajudar pessoas comuns e pequenas empresas a construírem uma relação mais saudável com o dinheiro.</p>
          <p>Nossa missão é simples: tornar a educação financeira humana, acessível e prática.</p>
        </div>
      </section>
    </SiteShell>
  );
}
