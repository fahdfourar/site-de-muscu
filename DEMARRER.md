# Démarrer KINEFORM

## 1. Copier les variables d'environnement

```
copy .env.local.example .env.local
```

Remplis `.env.local` avec tes vraies clés Supabase et Stripe.

## 2. Installer les dépendances

```
npm install
```

## 3. Lancer le serveur

```
npm run dev
```

Ouvre http://localhost:3000

## Tables Supabase à créer (SQL Editor)

```sql
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text default 'inactive',
  plan text default 'free',
  current_period_end timestamptz,
  created_at timestamptz default now()
);

alter table subscriptions enable row level security;

create policy "Users can read own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);
```
