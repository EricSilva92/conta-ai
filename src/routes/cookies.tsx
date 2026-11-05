import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Política de Cookies — Conta AI" },
      { name: "description", content: "Saiba quais cookies e tecnologias semelhantes o Conta AI utiliza e como gerenciá-los." },
      { property: "og:title", content: "Política de Cookies — Conta AI" },
      { property: "og:description", content: "Como usamos cookies no Conta AI." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage title="Política de Cookies" updated="5 de novembro de 2026">
      <p>Cookies são pequenos arquivos armazenados no seu navegador que ajudam o site a funcionar e a lembrar suas preferências.</p>
      <h2>1. Cookies que utilizamos</h2>
      <ul>
        <li><strong>Essenciais:</strong> mantêm você conectado e garantem a segurança da sessão. Não podem ser desativados.</li>
        <li><strong>Preferências:</strong> lembram escolhas como idioma e configurações de interface.</li>
        <li><strong>Desempenho:</strong> ajudam a entender, de forma agregada, como o site é usado para melhorá-lo.</li>
      </ul>
      <h2>2. Armazenamento local</h2>
      <p>Além de cookies, usamos o armazenamento local do navegador para manter sua sessão de login ativa.</p>
      <h2>3. Cookies de terceiros</h2>
      <p>Ao entrar com Google, o provedor pode definir cookies próprios, sujeitos à política de privacidade dele.</p>
      <h2>4. Como gerenciar</h2>
      <p>Você pode apagar ou bloquear cookies nas configurações do seu navegador. Bloquear cookies essenciais pode impedir o login.</p>
      <h2>5. Dúvidas</h2>
      <p>Consulte também nossa Política de Privacidade ou entre em contato pelos canais oficiais.</p>
    </LegalPage>
  ),
});
