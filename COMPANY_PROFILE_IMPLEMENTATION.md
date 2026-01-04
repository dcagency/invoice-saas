# Implémentation Company Profile - Récapitulatif

## Fichiers modifiés/créés

### Schéma Prisma
- ✅ **prisma/schema.prisma** - Mis à jour : `contactPerson` → `contactName`, `stateProvince` → `state`, ajout de `@@index([userId])`

### Routes API
- ✅ **app/api/company/profile/route.ts** - Créé/mis à jour : POST (création), GET (récupération), PATCH (mise à jour)
- ✅ **app/api/company/profile/status/route.ts** - Créé : GET (statut du profil)

### Pages
- ✅ **app/company/setup/page.tsx** - Créé/mis à jour : Page de configuration initiale avec redirection si profil existe
- ✅ **app/company/edit/page.tsx** - Créé/mis à jour : Page d'édition avec badge de complétude
- ✅ **app/dashboard/page.tsx** - Mis à jour : Vérification du profil, CTA si incomplet, résumé si complet

### Composants
- ✅ **components/CompanyProfileForm.tsx** - Créé : Formulaire avec mode create/edit, validation complète
- ✅ **components/CompanyProfileFormWrapper.tsx** - Créé : Wrapper pour gérer la soumission
- ✅ **components/ProfileCompletionBadge.tsx** - Créé : Badge indiquant si le profil est complet

### Utilitaires
- ✅ **lib/company-profile.ts** - Créé : Fonction helper `isProfileComplete()`

## Commandes exactes à exécuter

### 1. Générer le client Prisma
```bash
npm run db:generate
```

### 2. Appliquer les changements à la base de données
```bash
npm run db:push
```

**OU** si vous préférez créer une migration nommée :
```bash
npm run db:migrate
# Nommez la migration : update_company_profile_schema
```

### 3. Lancer l'application
```bash
npm run dev
```

## URLs à tester

### Pages principales
1. **`http://localhost:3000/company/setup`**
   - Page de configuration initiale
   - Doit rediriger vers `/company/edit` si un profil existe déjà
   - Formulaire avec tous les champs requis

2. **`http://localhost:3000/company/edit`**
   - Page d'édition du profil
   - Doit rediriger vers `/company/setup` si aucun profil n'existe
   - Affiche un badge de complétude (vert si complet, orange si incomplet)
   - Formulaire pré-rempli avec les données existantes

3. **`http://localhost:3000/dashboard`**
   - Doit rediriger vers `/company/setup` si aucun profil n'existe
   - Affiche un CTA "Complete Profile" si le profil est incomplet
   - Affiche un résumé du profil (nom de l'entreprise) si complet
   - Lien "Company Profile" dans la navigation

### Routes API
4. **`POST http://localhost:3000/api/company/profile`**
   - Création d'un profil
   - Doit retourner 409 si un profil existe déjà
   - Validation : companyName requis (2-200 caractères), email valide si fourni

5. **`GET http://localhost:3000/api/company/profile`**
   - Récupération du profil
   - Doit retourner 404 si aucun profil n'existe

6. **`PATCH http://localhost:3000/api/company/profile`**
   - Mise à jour du profil
   - Doit retourner 404 si aucun profil n'existe

7. **`GET http://localhost:3000/api/company/profile/status`**
   - Statut du profil (exists, isComplete, profile)
   - Retourne toujours 200 avec les informations de statut

## Mini plan de vérification (5 points)

### ✅ Point 1 : Migration Prisma
- [ ] Exécuter `npm run db:generate` → aucune erreur
- [ ] Exécuter `npm run db:push` → migration appliquée avec succès
- [ ] Vérifier dans Prisma Studio que la table `company_profiles` a les colonnes correctes :
  - `contact_name` (pas `contact_person`)
  - `state` (pas `state_province`)
  - Index sur `user_id`

### ✅ Point 2 : Création de profil
- [ ] Se connecter à l'application
- [ ] Accéder à `/company/setup` (ou être redirigé automatiquement depuis le dashboard)
- [ ] Remplir le formulaire avec :
  - Company Name : "Test Company"
  - Street Address : "123 Test St"
  - City : "Paris"
  - Postal Code : "75001"
  - Country : "France"
- [ ] Cliquer sur "Save and Continue"
- [ ] Vérifier la redirection vers `/dashboard`
- [ ] Vérifier que le profil apparaît dans le résumé du dashboard

### ✅ Point 3 : Édition de profil
- [ ] Accéder à `/company/edit`
- [ ] Vérifier que le badge affiche "✓ Your profile is complete" (vert)
- [ ] Modifier quelques champs (ex: Contact Person, Email)
- [ ] Cliquer sur "Save Changes"
- [ ] Vérifier que les modifications sont sauvegardées
- [ ] Vérifier la redirection vers `/dashboard`

### ✅ Point 4 : Validation et sécurité
- [ ] Tester la création avec companyName vide → doit afficher une erreur
- [ ] Tester la création avec email invalide → doit afficher une erreur
- [ ] Tester la création d'un deuxième profil (même utilisateur) → doit retourner 409
- [ ] Vérifier que l'utilisateur ne peut accéder qu'à son propre profil

### ✅ Point 5 : Complétude du profil
- [ ] Créer un profil avec seulement Company Name (sans adresse complète)
- [ ] Vérifier que le badge affiche "⚠ Complete your address" (orange)
- [ ] Vérifier que le dashboard affiche le CTA "Complete Profile"
- [ ] Compléter l'adresse (streetAddress, city, postalCode, country)
- [ ] Vérifier que le badge devient vert "✓ Your profile is complete"
- [ ] Vérifier que le CTA disparaît du dashboard

## Notes importantes

- **Relation 1:1** : Un utilisateur ne peut avoir qu'un seul profil (contrainte `@unique` sur `userId`)
- **Pas de suppression** : Il n'y a pas de route DELETE pour CompanyProfile
- **Redirections automatiques** :
  - `/company/setup` → `/company/edit` si profil existe
  - `/company/edit` → `/company/setup` si profil n'existe pas
  - `/dashboard` → `/company/setup` si profil n'existe pas
- **Complétude** : Un profil est complet si companyName + adresse complète (streetAddress, city, postalCode, country) sont renseignés

## Prochaines étapes (futures slices)

- La slice Invoice pourra utiliser `isProfileComplete()` pour vérifier que le profil est complet avant de permettre la création de factures
- Le `ProfileGuard` pourra être implémenté pour protéger les pages de création de factures


