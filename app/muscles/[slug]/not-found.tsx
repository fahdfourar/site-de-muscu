import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center text-center px-4">
      <div>
        <p className="text-8xl mb-6">💪</p>
        <h2 className="text-2xl font-bold text-white mb-2">Groupe musculaire introuvable</h2>
        <p className="text-white/50 mb-6">Ce groupe musculaire n&apos;existe pas encore.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-bold hover:opacity-90"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
