import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brand } from "@/components/site/Brand";
import { isAdmin } from "@/lib/auth-helpers";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Conta AI" },
      { name: "description", content: "Entre ou crie sua conta no Conta AI." },
      { property: "og:title", content: "Entrar — Conta AI" },
      { property: "og:description", content: "Acesse sua conta Conta AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function routeAfterLogin(userId: string, adminMode: boolean) {
    const admin = await isAdmin(userId);
    if (adminMode && !admin) {
      await supabase.auth.signOut();
      toast.error("Esta conta não tem acesso administrativo.");
      return;
    }
    navigate({ to: admin ? "/painel" : "/minha-conta" });
  }

  async function signIn(e: React.FormEvent<HTMLFormElement>, adminMode: boolean) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(f.get("email")),
      password: String(f.get("password")),
    });
    setLoading(false);
    if (error) {
      toast.error("E-mail ou senha incorretos.");
      return;
    }
    await routeAfterLogin(data.user.id, adminMode);
  }

  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: String(f.get("email")),
      password: String(f.get("password")),
      options: { emailRedirectTo: window.location.origin, data: { full_name: String(f.get("name")) } },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      await routeAfterLogin(data.user!.id, false);
      return;
    }
    toast.success("Conta criada! Confira seu e-mail para confirmar o cadastro.");
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) return toast.error("Não foi possível entrar com Google.");
    if (r.redirected) return;
    const { data } = await supabase.auth.getUser();
    if (data.user) await routeAfterLogin(data.user.id, false);
  }

  const GoogleBtn = (
    <Button type="button" variant="outline" className="w-full rounded-full" onClick={google}>
      Continuar com Google
    </Button>
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Brand size="lg" />
      <div className="card-panel mt-8 w-full max-w-md p-8">
        <Tabs defaultValue="entrar">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="entrar">Entrar</TabsTrigger>
            <TabsTrigger value="criar">Criar conta</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="entrar" className="mt-6 space-y-4">
            <form onSubmit={(e) => signIn(e, false)} className="space-y-4">
              <Field name="email" label="E-mail" type="email" />
              <Field name="password" label="Senha" type="password" />
              <Button disabled={loading} className="w-full rounded-full">Entrar</Button>
            </form>
            {GoogleBtn}
          </TabsContent>

          <TabsContent value="criar" className="mt-6 space-y-4">
            <form onSubmit={signUp} className="space-y-4">
              <Field name="name" label="Nome completo" />
              <Field name="email" label="E-mail" type="email" />
              <Field name="password" label="Senha (mín. 6 caracteres)" type="password" />
              <Button disabled={loading} className="w-full rounded-full">Criar conta</Button>
            </form>
            {GoogleBtn}
            <p className="text-center text-xs text-muted-foreground">
              Ao criar a conta, você concorda com os <Link to="/termos" className="underline">Termos</Link> e a{" "}
              <Link to="/privacidade" className="underline">Privacidade</Link>.
            </p>
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm text-secondary-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Acesso restrito à equipe Conta AI.
            </div>
            <form onSubmit={(e) => signIn(e, true)} className="space-y-4">
              <Field name="email" label="E-mail administrativo" type="email" />
              <Field name="password" label="Senha" type="password" />
              <Button disabled={loading} className="w-full rounded-full">Entrar como Admin</Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
      <Link to="/" className="mt-6 text-sm text-muted-foreground hover:text-foreground">← Voltar ao site</Link>
    </div>
  );
}

function Field({ name, label, type = "text" }: { name: string; label: string; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} required minLength={type === "password" ? 6 : undefined} className="h-11 rounded-xl" />
    </div>
  );
}
