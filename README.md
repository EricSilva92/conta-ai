# Conta AI Dashboard

Quero criar um sistema com uma interface exatamente como essa, para a empresa Conta AI, uma empresa criada pela Viviane Pereira, psicóloga e economista, com o objetivo de unir esses dois mundos e ajudar pessoas comuns e pequenas empresas a tomarem melhores decisões com base na psicologia financeira.

O ideal é o seguinte:

- Um site institucional sobre o Conta AI, com um botão de Entrar no topo, um rodapé bem estruturado com páginas completas de Cookies, Privacidade e Termos de uso.
- Uma tela de login com a opção de criar conta ou entrar e uma opção ADMIN, onde o usuário administrativo (no caso, a Viviane, por enquanto) possa entrar.
- Em seguida, a tela da imagem demonstrativa que te mandei.

Obs.: além da imagem da interface, estou mandando as logos do Conta AI.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ac11c818-e3bf-4482-921e-2340c01ff5a6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

You need Node.js and npm. Copy `.env.example` to `.env` and set the Supabase and AI credentials before running the app locally.

```sh
cp .env.example .env
npm install
npm run dev
```

## Deploy on Netlify

The project is configured for Netlify's Nitro server runtime. Set the build command to `npm run build` and the publish directory to `dist` (both are also defined in `netlify.toml`). Configure the variables listed in `.env.example` in Netlify's environment settings; keep server-only credentials private and never commit `.env`.

Before deploying database changes, apply pending migrations to the confirmed Supabase project with `npx drizzle-kit migrate` and a locally configured `LOVABLE_DB_MIGRATION_URL`. Do not add that migration credential to Netlify unless it is specifically needed there.
