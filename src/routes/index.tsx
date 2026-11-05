import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, HeartHandshake, LineChart, Store, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteLayout";
import heroLogo from "@/assets/contaai-logo-com-nome-e-slogan.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Conta AI — Psicologia financeira para decisões inteligentes" },
      { name: "description", content: "Conta AI une psicologia e economia para ajudar pessoas e pequenas empresas a tomarem melhores decisões financeiras." },
      { property: "og:title", content: "Conta AI — Psicologia financeira para decisões inteligentes" },
      { property: "og:description", content: "Atendimento com IA e acompanhamento humano para lidar melhor com o dinheiro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const features = [
  { icon: Brain, title: "Psicologia financeira", text: "Entenda os gatilhos emocionais por trás das suas compras, dívidas e decisões." },
  { icon: Sparkles, title: "Atendimento com IA", text: "Converse a qualquer hora com a assistente Conta AI, acolhedora e sem julgamentos." },
  { icon: HeartHandshake, title: "Acompanhamento humano", text: "Quando necessário, uma especialista assume a conversa para te apoiar de perto." },
  { icon: LineChart, title: "Metas possíveis", text: "Planos simples e realistas, que respeitam sua rotina e sua saúde emocional." },
  { icon: Store, title: "Pequenas empresas", text: "Organize o caixa do negócio e separe finanças pessoais das da empresa." },
  { icon: ShieldCheck, title: "Privacidade", text: "Seus dados são protegidos e tratados com sigilo, conforme a LGPD." },
];

function Home() {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-success-soft px-4 py-1.5 text-sm font-medium text-success">
            <span className="h-2 w-2 rounded-full bg-success" /> Psicologia + Economia
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] text-ink md:text-6xl">
            Decisões financeiras mais <span className="text-gradient-brand">leves e inteligentes</span>.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            O Conta AI ajuda pessoas comuns e pequenas empresas a entenderem a relação emocional com o dinheiro — e a transformar isso em escolhas melhores.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/auth">Começar agora</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link to="/como-funciona">Como funciona</Link>
            </Button>
          </div>
        </div>
        <div className="card-panel flex items-center justify-center p-10">
          <img src={heroLogo.url} alt="Conta AI — Psicologia financeira para decisões inteligentes" className="w-full max-w-sm mix-blend-multiply" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card-panel p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6">
        <div className="card-panel grid gap-8 p-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink">Criado por Viviane Pereira</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Psicóloga e economista, Viviane criou o Conta AI para unir esses dois mundos: o comportamento humano e as finanças. O resultado é um cuidado que olha para os números sem esquecer das pessoas.
            </p>
          </div>
          <Button asChild variant="secondary" className="rounded-full px-6">
            <Link to="/sobre">Conheça a história</Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
