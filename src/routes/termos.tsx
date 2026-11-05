import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Conta AI" },
      { name: "description", content: "Regras e condições para uso da plataforma Conta AI." },
      { property: "og:title", content: "Termos de Uso — Conta AI" },
      { property: "og:description", content: "Condições de uso da plataforma Conta AI." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage title="Termos de Uso" updated="5 de novembro de 2026">
      <p>Ao criar uma conta ou utilizar o Conta AI, você concorda com estes Termos de Uso. Leia-os com atenção.</p>
      <h2>1. O serviço</h2>
      <p>O Conta AI oferece orientação em psicologia financeira por meio de uma assistente de inteligência artificial, com supervisão e possível intervenção de uma especialista.</p>
      <h2>2. Natureza das orientações</h2>
      <p>As orientações têm caráter educativo e de apoio. Não substituem psicoterapia clínica, consultoria de investimentos, assessoria contábil ou jurídica. Em situações de crise emocional, procure atendimento profissional imediato ou o CVV (188).</p>
      <h2>3. Cadastro</h2>
      <ul>
        <li>Você deve fornecer informações verdadeiras e manter seus dados de acesso em sigilo.</li>
        <li>É necessário ter 18 anos ou mais para usar a plataforma.</li>
      </ul>
      <h2>4. Uso adequado</h2>
      <p>É proibido usar a plataforma para fins ilícitos, enviar conteúdo ofensivo, tentar acessar dados de terceiros ou comprometer a segurança do sistema.</p>
      <h2>5. Propriedade intelectual</h2>
      <p>A marca Conta AI, logotipos, textos e demais conteúdos pertencem aos seus titulares e não podem ser reproduzidos sem autorização.</p>
      <h2>6. Responsabilidades</h2>
      <p>As decisões financeiras tomadas a partir das orientações são de responsabilidade do usuário. O Conta AI não garante resultados financeiros específicos.</p>
      <h2>7. Encerramento</h2>
      <p>Você pode encerrar sua conta a qualquer momento. Podemos suspender contas que violem estes termos.</p>
      <h2>8. Alterações e foro</h2>
      <p>Estes termos podem ser atualizados; avisaremos sobre mudanças relevantes. Fica eleito o foro da comarca do domicílio do usuário, conforme o Código de Defesa do Consumidor.</p>
    </LegalPage>
  ),
});
