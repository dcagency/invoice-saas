# Guide de déploiement sur Vercel

Ce guide explique comment déployer l'application Invoice SaaS sur Vercel avec Clerk et Prisma.

## Prérequis

- Compte Vercel
- Compte Clerk
- Base de données PostgreSQL (Vercel Postgres, Supabase, ou autre)
- Compte Resend (optionnel, pour l'envoi d'emails)

## Variables d'environnement

### Variables obligatoires

#### Database
```bash
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

#### Clerk Authentication
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... ou pk_test_...
CLERK_SECRET_KEY=sk_live_... ou sk_test_...
```

#### Clerk URLs (optionnel mais recommandé)
```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

#### Next.js
```bash
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Variables optionnelles

#### Resend (pour l'envoi d'emails)
```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=your-email@example.com
```

## Configuration Clerk

### 1. Créer une application Clerk

1. Allez sur [https://clerk.com](https://clerk.com) et créez un compte
2. Créez une nouvelle application
3. Choisissez "Email" et "Google" comme providers OAuth

### 2. Configurer les domaines

1. Dans Clerk Dashboard → **Domains**
2. Ajoutez votre domaine Vercel (ex: `your-app.vercel.app`)
3. Pour la production, ajoutez votre domaine personnalisé

### 3. Configurer OAuth (Google)

1. Dans Clerk Dashboard → **User & Authentication** → **Social Connections**
2. Activez **Google**
3. Configurez les credentials Google OAuth :
   - Client ID
   - Client Secret
4. Ajoutez les URLs de callback autorisées :
   - `https://your-app.vercel.app`
   - `https://your-custom-domain.com` (si applicable)

### 4. Récupérer les clés API

1. Dans Clerk Dashboard → **API Keys**
2. Copiez :
   - **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** → `CLERK_SECRET_KEY`

## Configuration Vercel

### 1. Déployer depuis GitHub

1. Connectez votre repo GitHub à Vercel
2. Vercel détectera automatiquement Next.js
3. Configurez les variables d'environnement (voir ci-dessus)

### 2. Variables d'environnement dans Vercel

1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez toutes les variables listées ci-dessus
3. Pour la production, sélectionnez **Production**, **Preview**, et **Development**

### 3. Configuration du build

Le `package.json` contient déjà les scripts nécessaires :
- `postinstall`: Génère le client Prisma après `npm install`
- `build`: Génère Prisma puis build Next.js

Vercel exécutera automatiquement ces scripts.

### 4. Base de données

#### Option A: Vercel Postgres

1. Dans Vercel Dashboard → **Storage** → **Create Database** → **Postgres**
2. Copiez la `DATABASE_URL` fournie
3. Ajoutez-la aux variables d'environnement

#### Option B: Supabase / Autre

1. Créez votre base de données PostgreSQL
2. Ajoutez la `DATABASE_URL` aux variables d'environnement

### 5. Migrations Prisma

Après le premier déploiement :

```bash
# En local ou via Vercel CLI
npx prisma migrate deploy
```

Ou via Vercel CLI :
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

## Résolution des problèmes

### Erreur 500 lors du login Google

**Symptômes :**
- L'utilisateur clique sur "Sign in with Google"
- Redirection vers Clerk
- Erreur 500 après authentification

**Solutions :**

1. **Vérifier les variables d'environnement Clerk**
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` doit commencer par `pk_`
   - `CLERK_SECRET_KEY` doit commencer par `sk_`
   - Les deux doivent être du même environnement (test ou live)

2. **Vérifier les URLs de callback dans Clerk**
   - Dashboard Clerk → **Domains**
   - Le domaine Vercel doit être ajouté et vérifié
   - Les URLs de callback doivent correspondre exactement

3. **Vérifier les variables d'environnement dans Vercel**
   - Settings → Environment Variables
   - Toutes les variables `NEXT_PUBLIC_*` doivent être présentes
   - Redéployer après modification des variables

4. **Vérifier les logs Vercel**
   - Vercel Dashboard → **Deployments** → **Functions** → **View Function Logs**
   - Chercher les erreurs liées à Clerk ou Prisma

5. **Vérifier la connexion à la base de données**
   - `DATABASE_URL` doit être correcte
   - La base de données doit être accessible depuis Vercel
   - Les migrations Prisma doivent être appliquées

### Warnings "Dynamic server usage"

Ces warnings sont normaux pour les routes API qui utilisent `auth()` de Clerk. Toutes les routes API sont marquées avec :
- `export const dynamic = 'force-dynamic'`
- `export const runtime = 'nodejs'`

Ces warnings ne sont pas bloquants et n'affectent pas le fonctionnement de l'application.

### Erreur Prisma "Client not generated"

**Solution :**
- Le script `postinstall` dans `package.json` génère automatiquement le client Prisma
- Si le problème persiste, vérifiez que `prisma` est dans `devDependencies`
- Redéployez après modification de `package.json`

## Checklist de déploiement

- [ ] Base de données PostgreSQL créée et accessible
- [ ] Migrations Prisma appliquées (`prisma migrate deploy`)
- [ ] Application Clerk créée et configurée
- [ ] OAuth Google configuré dans Clerk
- [ ] Domaine Vercel ajouté dans Clerk
- [ ] Toutes les variables d'environnement configurées dans Vercel
- [ ] `DATABASE_URL` configurée et testée
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` configurée
- [ ] `CLERK_SECRET_KEY` configurée
- [ ] `NEXT_PUBLIC_APP_URL` configurée avec l'URL Vercel
- [ ] URLs Clerk configurées (optionnel mais recommandé)
- [ ] `RESEND_API_KEY` et `RESEND_FROM_EMAIL` configurées (si emails activés)
- [ ] Déploiement réussi sur Vercel
- [ ] Test de connexion avec Google OAuth
- [ ] Test de création de profil entreprise
- [ ] Test de création d'invoice

## Support

En cas de problème :
1. Vérifiez les logs Vercel
2. Vérifiez les logs Clerk Dashboard
3. Vérifiez que toutes les variables d'environnement sont correctes
4. Vérifiez que les migrations Prisma sont appliquées

