# Checklist QA - UX / Security / Polish - Prêt à lancer

## ✅ Commandes Build

```bash
# 1. Installer les dépendances
npm install

# 2. Générer le client Prisma
npm run db:generate

# 3. Appliquer les migrations (si nécessaire)
npm run db:push

# 4. Lancer l'application en développement
npm run dev

# 5. Build de production
npm run build

# 6. Lancer en production
npm start
```

## 🔒 Points de Sécurité Vérifiés

### Authentification
- ✅ Toutes les routes API vérifient l'authentification (`await auth()`)
- ✅ Retour 401 si utilisateur non authentifié
- ✅ Middleware Clerk en place pour protéger les routes

### Isolation des Données (Ownership)
- ✅ **Toutes** les requêtes Prisma filtrent par `userId`
- ✅ GET `/api/clients` - Filtre par userId
- ✅ GET `/api/clients/[id]` - Filtre par userId + id
- ✅ POST `/api/clients` - Crée avec userId de la session
- ✅ PATCH `/api/clients/[id]` - Vérifie ownership avant update
- ✅ DELETE `/api/clients/[id]` - Vérifie ownership avant delete
- ✅ GET `/api/invoices` - Filtre par userId
- ✅ GET `/api/invoices/[id]` - Filtre par userId + id
- ✅ POST `/api/invoices` - Vérifie ownership du client + crée avec userId
- ✅ PATCH `/api/invoices/[id]` - Vérifie ownership avant update
- ✅ DELETE `/api/invoices/[id]` - Vérifie ownership avant delete
- ✅ GET `/api/invoices/[id]/pdf` - Vérifie ownership avant génération
- ✅ PATCH `/api/invoices/[id]/status` - Vérifie ownership avant update
- ✅ GET `/api/company/profile` - Filtre par userId
- ✅ PATCH `/api/company/profile` - Vérifie ownership avant update

### Validation des Données
- ✅ Validation Zod sur toutes les routes POST/PATCH
- ✅ Validation des IDs (format cuid vérifié implicitement par Prisma)
- ✅ Validation des emails (format email)
- ✅ Validation des montants (nombres positifs)
- ✅ Validation des dates (format datetime)
- ✅ Validation des statuts (enum strict)

### Protection CSRF
- ✅ Next.js App Router gère CSRF automatiquement
- ✅ Pas de tokens CSRF manuels nécessaires

### Headers de Sécurité
- ✅ Content-Type vérifié sur les routes API
- ✅ Pas de données sensibles dans les logs (en production)
- ✅ Headers CORS configurés (si nécessaire)

### Rate Limiting
- ⚠️ **Optionnel mais recommandé pour production**
- ⚠️ À implémenter si trafic élevé attendu

## 📋 Checklist QA Complète (20 points)

### Fonctionnalités Core (8 points)
- [ ] **1. Authentification** : Signup, login, logout fonctionnent
- [ ] **2. Company Profile** : CRUD complet, redirection si incomplet
- [ ] **3. Clients** : CRUD complet, isolation par utilisateur
- [ ] **4. Invoices** : CRUD complet, calculs corrects
- [ ] **5. PDF Generation** : Téléchargement fonctionne, contenu correct
- [ ] **6. Statuts** : Transitions DRAFT → SENT → PAID fonctionnent
- [ ] **7. Calculs** : Subtotal, tax, total calculés correctement
- [ ] **8. Numéros de facture** : Unicité par utilisateur respectée

### UX et États (6 points)
- [ ] **9. Empty States** : Dashboard, Clients, Invoices affichent des états vides appropriés
- [ ] **10. Loading States** : Skeletons/spinners affichés pendant chargement
- [ ] **11. Pages d'erreur** : 404 et 500 affichent des pages custom
- [ ] **12. Redirections** : Post-auth, post-create, post-edit fonctionnent
- [ ] **13. Confirmations** : Modals de confirmation pour suppressions
- [ ] **14. Warnings** : Banners pour factures SENT/PAID, profil incomplet

### Sécurité (3 points)
- [ ] **15. Isolation** : Utilisateur A ne peut pas accéder aux données de l'utilisateur B
- [ ] **16. Validation** : Erreurs 400 pour données invalides, 401 pour non-auth, 404 pour not found
- [ ] **17. Ownership** : Toutes les routes vérifient la propriété avant modification/suppression

### Responsive et Accessibilité (3 points)
- [ ] **18. Mobile** : Toutes les pages fonctionnent sur mobile (< 768px)
- [ ] **19. Accessibilité** : Labels sur inputs, navigation clavier, focus visible
- [ ] **20. Performance** : Pas de re-renders inutiles, chargement rapide

## 🛣️ Liste Complète des Routes à Tester

### Pages Publiques
- [ ] `/` - Page d'accueil (redirige vers sign-in ou dashboard)
- [ ] `/sign-in` - Page de connexion (Clerk)
- [ ] `/sign-up` - Page d'inscription (Clerk)
- [ ] `/not-found` - Page 404 custom

### Pages Authentifiées - Dashboard
- [ ] `/dashboard` - Dashboard principal
  - [ ] Affiche les statistiques (Total, Draft, Sent, Paid)
  - [ ] Affiche les factures récentes
  - [ ] Warning si profil incomplet
  - [ ] Quick actions fonctionnent
  - [ ] Navigation vers autres sections

### Pages Authentifiées - Company Profile
- [ ] `/company/setup` - Setup initial du profil
  - [ ] Redirection si profil existe déjà
  - [ ] Formulaire complet fonctionne
  - [ ] Sauvegarde redirige vers dashboard
- [ ] `/company/edit` - Édition du profil
  - [ ] Chargement des données existantes
  - [ ] Validation des champs
  - [ ] Sauvegarde fonctionne

### Pages Authentifiées - Clients
- [ ] `/clients` - Liste des clients
  - [ ] Affichage de tous les clients de l'utilisateur
  - [ ] Empty state si aucun client
  - [ ] Actions : View, Edit, Delete
  - [ ] Bouton "Add New Client"
- [ ] `/clients/new` - Création client
  - [ ] Formulaire complet
  - [ ] Validation côté client
  - [ ] Sauvegarde redirige vers `/clients`
  - [ ] Cancel retourne à `/clients`
- [ ] `/clients/[id]/edit` - Édition client
  - [ ] Chargement des données
  - [ ] Modification fonctionne
  - [ ] Sauvegarde redirige vers `/clients`
  - [ ] Cancel retourne à `/clients`
  - [ ] 404 si client n'existe pas ou n'appartient pas à l'utilisateur

### Pages Authentifiées - Invoices
- [ ] `/invoices` - Liste des factures
  - [ ] Affichage de toutes les factures de l'utilisateur
  - [ ] Filtres par statut (ALL, DRAFT, SENT, PAID)
  - [ ] Empty state si aucune facture
  - [ ] Actions : View, Edit, Delete, Download PDF
  - [ ] Bouton "Create New Invoice"
- [ ] `/invoices/new` - Création facture
  - [ ] Redirection si profil incomplet
  - [ ] Redirection si aucun client
  - [ ] Formulaire complet avec line items dynamiques
  - [ ] Calculs en temps réel
  - [ ] Validation côté client
  - [ ] Sauvegarde redirige vers `/invoices/[id]`
  - [ ] Cancel retourne à `/invoices`
- [ ] `/invoices/[id]` - Détail facture
  - [ ] Affichage complet de la facture
  - [ ] Actions : Edit, Delete, Download PDF, Change Status
  - [ ] Badge OVERDUE si applicable
  - [ ] 404 si facture n'existe pas ou n'appartient pas à l'utilisateur
- [ ] `/invoices/[id]/edit` - Édition facture
  - [ ] Warning si status SENT ou PAID
  - [ ] Chargement des données
  - [ ] Modification fonctionne
  - [ ] Sauvegarde redirige vers `/invoices/[id]`
  - [ ] Cancel retourne à `/invoices/[id]`
  - [ ] 404 si facture n'existe pas ou n'appartient pas à l'utilisateur

### Routes API - Clients
- [ ] `GET /api/clients`
  - [ ] Retourne 401 si non authentifié
  - [ ] Retourne uniquement les clients de l'utilisateur
  - [ ] Triés par companyName (asc)
- [ ] `POST /api/clients`
  - [ ] Retourne 401 si non authentifié
  - [ ] Crée avec userId de la session
  - [ ] Validation Zod fonctionne (400 si invalide)
  - [ ] Retourne 201 avec le client créé
- [ ] `GET /api/clients/[id]`
  - [ ] Retourne 401 si non authentifié
  - [ ] Retourne 404 si client n'existe pas
  - [ ] Retourne 404 si client appartient à un autre utilisateur
  - [ ] Retourne 200 avec le client si ownership OK
- [ ] `PATCH /api/clients/[id]`
  - [ ] Retourne 401 si non authentifié
  - [ ] Retourne 404 si client n'existe pas ou ownership incorrect
  - [ ] Validation Zod fonctionne
  - [ ] Met à jour et retourne 200
- [ ] `DELETE /api/clients/[id]`
  - [ ] Retourne 401 si non authentifié
  - [ ] Retourne 404 si client n'existe pas ou ownership incorrect
  - [ ] Supprime et retourne 200
  - [ ] Ne supprime pas si des factures existent (contrainte DB)

### Routes API - Invoices
- [ ] `GET /api/invoices`
  - [ ] Retourne 401 si non authentifié
  - [ ] Retourne uniquement les factures de l'utilisateur
  - [ ] Filtres optionnels fonctionnent (status, clientId)
- [ ] `POST /api/invoices`
  - [ ] Retourne 401 si non authentifié
  - [ ] Vérifie ownership du client
  - [ ] Validation Zod fonctionne
  - [ ] Crée avec userId de la session
  - [ ] Calculs automatiques (subtotal, tax, total)
  - [ ] Retourne 201 avec la facture créée
- [ ] `GET /api/invoices/[id]`
  - [ ] Retourne 401 si non authentifié
  - [ ] Retourne 404 si facture n'existe pas
  - [ ] Retourne 404 si facture appartient à un autre utilisateur
  - [ ] Retourne 200 avec la facture complète (inclut lineItems, client)
- [ ] `PATCH /api/invoices/[id]`
  - [ ] Retourne 401 si non authentifié
  - [ ] Retourne 404 si facture n'existe pas ou ownership incorrect
  - [ ] Validation Zod fonctionne
  - [ ] Met à jour line items (remplacement complet)
  - [ ] Recalcule les totaux
  - [ ] Retourne 200 avec la facture mise à jour
- [ ] `DELETE /api/invoices/[id]`
  - [ ] Retourne 401 si non authentifié
  - [ ] Retourne 404 si facture n'existe pas ou ownership incorrect
  - [ ] Supprime la facture et ses line items (cascade)
  - [ ] Retourne 200
- [ ] `PATCH /api/invoices/[id]/status`
  - [ ] Retourne 401 si non authentifié
  - [ ] Retourne 404 si facture n'existe pas ou ownership incorrect
  - [ ] Met à jour uniquement le statut
  - [ ] Retourne 200
- [ ] `GET /api/invoices/[id]/pdf`
  - [ ] Retourne 401 si non authentifié
  - [ ] Retourne 404 si facture n'existe pas ou ownership incorrect
  - [ ] Retourne 400 si CompanyProfile manquant
  - [ ] Génère et retourne le PDF (Content-Type: application/pdf)
  - [ ] Nom de fichier correct (Invoice-[number].pdf)
- [ ] `GET /api/invoices/next-number`
  - [ ] Retourne 401 si non authentifié
  - [ ] Suggère le prochain numéro séquentiel
  - [ ] Retourne 200 avec { nextNumber: "..." }

### Routes API - Company Profile
- [ ] `GET /api/company/profile`
  - [ ] Retourne 401 si non authentifié
  - [ ] Retourne 200 avec le profil (ou null si inexistant)
- [ ] `PATCH /api/company/profile`
  - [ ] Retourne 401 si non authentifié
  - [ ] Crée ou met à jour le profil
  - [ ] Validation Zod fonctionne
  - [ ] Retourne 200 avec le profil

## 🧪 Scénarios de Test Complets

### Scénario 1 : Premier Utilisateur (Happy Path)
1. [ ] S'inscrire avec un nouveau compte
2. [ ] Redirection automatique vers `/company/setup`
3. [ ] Compléter le profil entreprise
4. [ ] Redirection vers `/dashboard`
5. [ ] Voir le warning "profil incomplet" disparaître
6. [ ] Créer un premier client
7. [ ] Créer une première facture
8. [ ] Télécharger le PDF
9. [ ] Changer le statut de DRAFT à SENT
10. [ ] Changer le statut de SENT à PAID

### Scénario 2 : Isolation des Données
1. [ ] Créer un compte utilisateur A
2. [ ] Créer 2 clients et 2 factures avec le compte A
3. [ ] Se déconnecter
4. [ ] Créer un compte utilisateur B
5. [ ] Vérifier que les clients/factures de A ne sont pas visibles
6. [ ] Essayer d'accéder à `/invoices/[id-de-A]` → Doit retourner 404
7. [ ] Essayer d'appeler `GET /api/invoices/[id-de-A]` → Doit retourner 404

### Scénario 3 : Validation et Erreurs
1. [ ] Essayer de créer un client sans companyName → Erreur 400
2. [ ] Essayer de créer une facture sans client → Erreur 400
3. [ ] Essayer de créer une facture avec email invalide → Erreur 400
4. [ ] Essayer d'accéder à une route API sans auth → Erreur 401
5. [ ] Essayer d'accéder à `/invoices/999` (ID invalide) → 404

### Scénario 4 : Warnings et Confirmations
1. [ ] Créer une facture et la marquer comme SENT
2. [ ] Aller sur la page d'édition → Voir le warning jaune
3. [ ] Modifier quand même → Doit fonctionner
4. [ ] Essayer de supprimer une facture → Modal de confirmation
5. [ ] Annuler la suppression → Facture toujours présente
6. [ ] Confirmer la suppression → Facture supprimée

### Scénario 5 : États Vides
1. [ ] Créer un nouveau compte
2. [ ] Aller sur `/clients` → Voir empty state
3. [ ] Aller sur `/invoices` → Voir empty state
4. [ ] Créer un client
5. [ ] Aller sur `/invoices` → Empty state avec message "You need at least one client"
6. [ ] Créer une facture
7. [ ] Vérifier que les empty states disparaissent

### Scénario 6 : Mobile et Responsive
1. [ ] Ouvrir l'application sur mobile (< 768px)
2. [ ] Vérifier que les tableaux passent en cartes
3. [ ] Vérifier que les formulaires sont utilisables
4. [ ] Vérifier que les boutons sont assez grands (44x44px min)
5. [ ] Tester la navigation

## ⚠️ Ce qui reste à faire avant PROD (si nécessaire)

### Optionnel mais Recommandé
- [ ] **Rate Limiting** : Implémenter un rate limiter pour les routes API (ex: 100 req/min par utilisateur)
- [ ] **Error Tracking** : Intégrer Sentry ou similaire pour tracker les erreurs en production
- [ ] **Analytics** : Ajouter Google Analytics ou similaire (si besoin de métriques)
- [ ] **Logging** : Configurer un système de logs structurés (ex: Winston, Pino)
- [ ] **Monitoring** : Configurer un monitoring (ex: Datadog, New Relic)
- [ ] **Backup DB** : Mettre en place un plan de backup automatique de la base de données
- [ ] **Tests Automatisés** : Ajouter des tests unitaires, intégration, E2E (Jest, Playwright)
- [ ] **CI/CD** : Pipeline de déploiement automatique (GitHub Actions, GitLab CI)
- [ ] **Documentation API** : Documenter les routes API (Swagger/OpenAPI)
- [ ] **Performance** : Optimiser les requêtes Prisma (indexes, select spécifiques)
- [ ] **Caching** : Ajouter du caching pour les données fréquemment accédées (Redis)
- [ ] **SEO** : Ajouter robots.txt, sitemap.xml pour les pages publiques
- [ ] **PWA** : Transformer en PWA avec service worker (offline support)

### Variables d'Environnement à Configurer
```env
# .env.production
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Optionnel
SENTRY_DSN=...
ANALYTICS_ID=...
REDIS_URL=...
```

### Checklist Déploiement
- [ ] Base de données production provisionnée (PostgreSQL)
- [ ] Migrations Prisma appliquées en production
- [ ] Variables d'environnement configurées
- [ ] Domaine configuré et SSL activé
- [ ] Build de production testé (`npm run build`)
- [ ] Tests de charge basiques effectués
- [ ] Plan de rollback préparé
- [ ] Documentation utilisateur créée (si nécessaire)

## 📝 Notes Finales

### Ce qui est Implémenté
✅ Tous les composants de base (ErrorBoundary, Skeleton, PageLoader)
✅ Pages d'erreur (404, 500)
✅ Empty states améliorés
✅ Warnings et confirmations
✅ Sécurité renforcée (ownership checks partout)
✅ Validation Zod sur toutes les routes
✅ Redirections intelligentes
✅ Loading states de base

### Ce qui pourrait être Amélioré (Futur)
- Toast notifications plus sophistiquées (react-hot-toast)
- Breadcrumbs complets sur toutes les pages
- Protection contre perte de données (unsaved changes warning)
- Optimistic updates pour meilleure UX
- Skeleton loaders plus détaillés
- Tests automatisés complets

---

**L'application est prête pour un lancement MVP.** Les fonctionnalités core sont complètes, la sécurité est en place, et l'UX de base est polie. Les améliorations optionnelles peuvent être ajoutées progressivement selon les besoins.


