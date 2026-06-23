import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MUSCLE_GROUPS } from "@/data/exercises";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const name =
    user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Athlète";

  return (
    <div className="min-h-screen bg-ink-900 pt-28 bp-dots">
      <div className="max-w-6xl mx-auto px-5 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="eyebrow text-volt mb-3">// Ton espace</p>
            <h1 className="font-display font-extrabold text-5xl text-bone tracking-tightest">
              Salut, {name}.
            </h1>
            <p className="text-bone-muted mt-2">
              Choisis un muscle et reprends ton entraînement.
            </p>
          </div>
          <Link
            href="/pricing"
            className="flex items-center gap-2 btn-volt px-5 py-3 rounded-xl self-start"
          >
            <Sparkles className="w-4 h-4" />
            Passer Pro
          </Link>
        </div>

        {/* Muscle grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {MUSCLE_GROUPS.map((group, i) => (
            <Link
              key={group.slug}
              href={`/muscles/${group.slug}`}
              className="group relative bg-ink-700 border border-ink-line rounded-2xl p-5 hover:border-ink-500 transition-all overflow-hidden"
            >
              <div
                className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                style={{ backgroundColor: group.color }}
              />
              <div className="pl-3">
                <span className="font-mono text-[11px] text-bone-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display font-bold text-bone mt-3 mb-1">
                  {group.name}
                </h3>
                <p className="font-mono text-[11px] text-bone-faint mb-3">
                  {group.exercises.length} exos
                </p>
                <ArrowUpRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: group.color }}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Plan strip */}
        <div className="bg-ink-700 border border-ink-line rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-ink-600 text-bone-muted">
                PLAN ACTUEL
              </span>
              <span className="text-bone font-semibold">Starter</span>
            </div>
            <p className="text-bone-muted text-sm">
              Passe Pro pour débloquer les 9 groupes et tous les exercices.
            </p>
          </div>
          <Link
            href="/pricing"
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl btn-volt"
          >
            Voir les tarifs
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
