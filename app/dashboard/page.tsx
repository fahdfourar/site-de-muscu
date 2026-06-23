import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MUSCLE_GROUPS } from "@/data/exercises";
import { Zap, ArrowRight, User } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const name = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Athlète";

  return (
    <div className="min-h-screen bg-bg-primary pt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center">
                <User className="w-5 h-5 text-accent-purple" />
              </div>
              <div>
                <p className="text-white/50 text-sm">Bonjour,</p>
                <h1 className="text-2xl font-bold text-white">{name}</h1>
              </div>
            </div>
          </div>

          <Link
            href="/pricing"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <Zap className="w-3.5 h-3.5" />
            Passer Pro
          </Link>
        </div>

        {/* Muscle grid */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">
            Tes exercices
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MUSCLE_GROUPS.map((group) => (
              <Link
                key={group.slug}
                href={`/muscles/${group.slug}`}
                className="group bg-bg-card border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all hover:scale-[1.02]"
              >
                <div
                  className="w-2 h-2 rounded-full mb-3"
                  style={{ backgroundColor: group.color }}
                />
                <h3 className="text-white font-semibold text-sm mb-1">
                  {group.name}
                </h3>
                <p className="text-white/40 text-xs mb-3">
                  {group.exercises.length} exercices
                </p>
                <ArrowRight
                  className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all"
                  style={{ color: group.color }}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Pro upsell */}
        <div className="bg-bg-card border border-accent-purple/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-accent-purple" />
              <span className="text-white font-bold">Plan actuel : Starter</span>
            </div>
            <p className="text-white/50 text-sm">
              Passe à Pro pour débloquer tous les groupes musculaires et exercices.
            </p>
          </div>
          <Link
            href="/pricing"
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-bold text-sm hover:opacity-90"
          >
            Voir les tarifs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
