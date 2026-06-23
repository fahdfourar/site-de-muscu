import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center text-center px-5 bp-grid">
      <div>
        <p className="font-display font-extrabold text-8xl text-volt tracking-tightest mb-4">
          404
        </p>
        <h2 className="font-display font-bold text-2xl text-bone mb-2">
          Groupe musculaire introuvable
        </h2>
        <p className="text-bone-muted mb-8">Ce groupe n&apos;existe pas (encore).</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 btn-volt px-6 py-3 rounded-xl"
        >
          Retour à l&apos;accueil
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
