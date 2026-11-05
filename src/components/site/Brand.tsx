import { Link } from "@tanstack/react-router";
import iconAsset from "@/assets/contaai-logo-sem-nome.png.asset.json";
import nameAsset from "@/assets/contaai-nome-sem-logo.png.asset.json";

export const logoIconUrl = iconAsset.url;

export function Brand({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const h = size === "lg" ? "h-14" : size === "sm" ? "h-8" : "h-10";
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="Conta AI — início">
      <img src={iconAsset.url} alt="" className={`${h} w-auto mix-blend-multiply`} />
      <img src={nameAsset.url} alt="Conta AI" className={`${h} w-auto mix-blend-multiply`} />
    </Link>
  );
}
