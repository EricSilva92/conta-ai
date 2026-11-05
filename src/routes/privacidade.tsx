import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Conta AI" },
      { name: "description", content: "Como o Conta AI coleta, usa e protege seus dados pessoais, em conformidade com a LGPD." },
      { property: "og:title", content: "Política de Privacidade — Conta AI" },
      { property: "og:description", content: "Transparência sobre o tratamento dos seus dados." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage title="Política de Privacidade" updated="5 de novembro de 2026">
      <p>Esta Política de Privacidade descreve como o Conta AI ("nós") coleta, utiliza, armazena e protege os dados pessoais dos usuários, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).</p>
      <h2>1. Dados que coletamos</h2>
      <ul>
        <li>Dados de cadastro: nome, e-mail e foto de perfil (quando usado login com Google).</li>
        <li>Conteúdo das conversas com a assistente Conta AI e com a equipe.</li>
        <li>Dados técnicos: endereço IP, tipo de navegador, data e hora de acesso.</li>
      </ul>
      <h2>2. Finalidades do tratamento</h2>
      <ul>
        <li>Prestar o atendimento de psicologia financeira e orientação.</li>
        <li>Personalizar recomendações e acompanhar sua evolução.</li>
        <li>Garantir a segurança da plataforma e cumprir obrigações legais.</li>
      </ul>
      <h2>3. Inteligência artificial</h2>
      <p>As mensagens podem ser processadas por modelos de inteligência artificial para gerar respostas. Esses dados não são usados para fins publicitários. A especialista responsável pode revisar as conversas para garantir a qualidade do atendimento.</p>
      <h2>4. Compartilhamento</h2>
      <p>Não vendemos seus dados. Compartilhamos apenas com fornecedores essenciais à operação (hospedagem, autenticação e processamento de IA), sob obrigações de confidencialidade.</p>
      <h2>5. Armazenamento e segurança</h2>
      <p>Adotamos medidas técnicas e administrativas para proteger seus dados contra acesso não autorizado, perda ou alteração. Os dados são mantidos enquanto sua conta estiver ativa ou pelo tempo exigido por lei.</p>
      <h2>6. Seus direitos</h2>
      <ul>
        <li>Confirmar a existência de tratamento e acessar seus dados.</li>
        <li>Corrigir dados incompletos ou desatualizados.</li>
        <li>Solicitar anonimização, bloqueio ou eliminação.</li>
        <li>Revogar o consentimento e solicitar a portabilidade.</li>
      </ul>
      <h2>7. Contato</h2>
      <p>Para exercer seus direitos ou tirar dúvidas, entre em contato pelo e-mail informado em nossos canais oficiais.</p>
    </LegalPage>
  ),
});
