# Checklist de Test - Clients Slice CRUD

## Prérequis

1. ✅ Base de données PostgreSQL configurée et accessible
2. ✅ Variables d'environnement configurées (.env avec DATABASE_URL, Clerk keys)
3. ✅ Dépendances installées (`npm install`)
4. ✅ Migration Prisma appliquée (`npm run db:push` ou `npm run db:migrate`)
5. ✅ Serveur de développement lancé (`npm run dev`)
6. ✅ Compte utilisateur créé et authentifié via Clerk

---

## Tests de Migration Prisma

### Test 1: Vérifier le schéma Client
- [ ] Exécuter `npm run db:push` (ou `npm run db:migrate`)
- [ ] Vérifier qu'aucune erreur n'est générée
- [ ] Vérifier que la table `clients` existe dans la base de données
- [ ] Vérifier que les colonnes suivantes existent :
  - [ ] `id`, `user_id`, `company_name`, `contact_name`, `email`, `phone`
  - [ ] `street_address`, `city`, `state`, `postal_code`, `country`
  - [ ] `tax_id`, `notes`, `created_at`, `updated_at`
- [ ] Vérifier que l'index sur `user_id` existe

---

## Tests de Navigation

### Test 2: Accès aux pages Clients
- [ ] Se connecter à l'application
- [ ] Vérifier que le lien "View All Clients" existe dans le dashboard
- [ ] Cliquer sur "View All Clients" → doit rediriger vers `/clients`
- [ ] Vérifier que la page `/clients` s'affiche correctement
- [ ] Vérifier que le header contient "Clients" et le bouton UserButton

---

## Tests de la Page Liste (/clients)

### Test 3: État vide (aucun client)
- [ ] Accéder à `/clients` sans avoir créé de client
- [ ] Vérifier que l'état vide s'affiche avec :
  - [ ] Message "No clients yet"
  - [ ] Description "Add your first client to get started."
  - [ ] Bouton "Add your first client"
- [ ] Cliquer sur le bouton → doit rediriger vers `/clients/new`

### Test 4: Liste avec clients
- [ ] Créer au moins 2-3 clients (via l'API ou l'interface)
- [ ] Accéder à `/clients`
- [ ] Vérifier que le tableau s'affiche avec les colonnes :
  - [ ] Company Name
  - [ ] Contact Person
  - [ ] Email
  - [ ] City
  - [ ] Actions
- [ ] Vérifier que les clients sont triés par ordre alphabétique (companyName)
- [ ] Vérifier que le bouton "Add New Client" est visible en haut à droite

### Test 5: Responsive (mobile)
- [ ] Réduire la largeur du navigateur à < 768px
- [ ] Vérifier que le tableau devient des cartes
- [ ] Vérifier que chaque carte affiche les informations du client
- [ ] Vérifier que les boutons Edit/Delete sont visibles sur chaque carte

---

## Tests de Création (/clients/new)

### Test 6: Accès à la page de création
- [ ] Depuis `/clients`, cliquer sur "Add New Client"
- [ ] Vérifier la redirection vers `/clients/new`
- [ ] Vérifier que le formulaire s'affiche avec toutes les sections :
  - [ ] Section "Basic Information" (Company Name*, Contact Person, Email, Phone)
  - [ ] Section "Address" (Street Address, City, State/Province, Postal Code, Country)
  - [ ] Section "Additional Information" (Tax ID/VAT Number, Notes)

### Test 7: Validation client-side
- [ ] Laisser Company Name vide et soumettre → doit afficher une erreur
- [ ] Entrer un email invalide (ex: "test@") → doit afficher une erreur
- [ ] Entrer un email valide → l'erreur doit disparaître
- [ ] Remplir Company Name → l'erreur doit disparaître

### Test 8: Création réussie
- [ ] Remplir le formulaire avec :
  - [ ] Company Name: "Test Company"
  - [ ] Contact Person: "John Doe"
  - [ ] Email: "john@test.com"
  - [ ] Autres champs optionnels
- [ ] Cliquer sur "Save Client"
- [ ] Vérifier que le client est créé
- [ ] Vérifier la redirection vers `/clients`
- [ ] Vérifier que le nouveau client apparaît dans la liste
- [ ] Vérifier le message de succès (alert ou toast)

### Test 9: Annulation
- [ ] Aller sur `/clients/new`
- [ ] Remplir quelques champs
- [ ] Cliquer sur "Cancel"
- [ ] Vérifier la redirection vers `/clients`
- [ ] Vérifier que les données ne sont pas sauvegardées

---

## Tests d'Édition (/clients/[id]/edit)

### Test 10: Accès à la page d'édition
- [ ] Depuis `/clients`, cliquer sur "Edit" d'un client
- [ ] Vérifier la redirection vers `/clients/[id]/edit`
- [ ] Vérifier que le formulaire est pré-rempli avec les données du client
- [ ] Vérifier que le titre affiche "Edit Client"

### Test 11: Modification réussie
- [ ] Modifier quelques champs (ex: Contact Person, Email)
- [ ] Cliquer sur "Save Changes"
- [ ] Vérifier que les modifications sont sauvegardées
- [ ] Vérifier la redirection vers `/clients`
- [ ] Vérifier que les modifications apparaissent dans la liste
- [ ] Vérifier le message de succès

### Test 12: Protection d'accès (sécurité)
- [ ] Noter l'ID d'un client appartenant à votre compte
- [ ] Essayer d'accéder à `/clients/[autre-id]/edit` avec un ID qui n'existe pas
- [ ] Vérifier la redirection vers `/clients`
- [ ] (Optionnel) Créer un deuxième compte et essayer d'accéder au client du premier compte → doit retourner 404

---

## Tests de Suppression

### Test 13: Modal de confirmation
- [ ] Depuis `/clients`, cliquer sur "Delete" d'un client
- [ ] Vérifier que la modal de confirmation s'affiche
- [ ] Vérifier que le message contient le nom du client
- [ ] Vérifier que les boutons "Cancel" et "Delete" sont présents
- [ ] Cliquer sur "Cancel" → la modal doit se fermer, le client doit toujours exister

### Test 14: Suppression réussie
- [ ] Cliquer sur "Delete" d'un client
- [ ] Dans la modal, cliquer sur "Delete"
- [ ] Vérifier que le client est supprimé
- [ ] Vérifier que le client disparaît de la liste
- [ ] Vérifier le message de succès

### Test 15: Protection de suppression (sécurité)
- [ ] Essayer de supprimer un client qui n'existe pas ou n'appartient pas à l'utilisateur
- [ ] Vérifier que l'erreur 404 est retournée

---

## Tests des Routes API

### Test 16: GET /api/clients
- [ ] Faire une requête GET vers `/api/clients` (authentifié)
- [ ] Vérifier que la réponse contient un tableau de clients
- [ ] Vérifier que seuls les clients de l'utilisateur authentifié sont retournés
- [ ] Vérifier que les clients sont triés par companyName (asc)

### Test 17: POST /api/clients
- [ ] Faire une requête POST vers `/api/clients` avec des données valides
- [ ] Vérifier le code de statut 201
- [ ] Vérifier que le client est créé avec le bon userId
- [ ] Tester avec companyName vide → doit retourner 400
- [ ] Tester avec email invalide → doit retourner 400
- [ ] Tester sans authentification → doit retourner 401

### Test 18: GET /api/clients/[id]
- [ ] Faire une requête GET vers `/api/clients/[id]` avec un ID valide
- [ ] Vérifier que le client est retourné
- [ ] Tester avec un ID qui n'existe pas → doit retourner 404
- [ ] Tester avec un ID d'un autre utilisateur → doit retourner 404
- [ ] Tester sans authentification → doit retourner 401

### Test 19: PATCH /api/clients/[id]
- [ ] Faire une requête PATCH vers `/api/clients/[id]` avec des données valides
- [ ] Vérifier que le client est mis à jour
- [ ] Tester avec companyName vide → doit retourner 400
- [ ] Tester avec un ID qui n'existe pas → doit retourner 404
- [ ] Tester sans authentification → doit retourner 401

### Test 20: DELETE /api/clients/[id]
- [ ] Faire une requête DELETE vers `/api/clients/[id]` avec un ID valide
- [ ] Vérifier que le client est supprimé
- [ ] Tester avec un ID qui n'existe pas → doit retourner 404
- [ ] Tester sans authentification → doit retourner 401

---

## Tests de Sécurité

### Test 21: Isolation des données
- [ ] Créer 2 comptes utilisateurs différents
- [ ] Créer des clients avec le compte 1
- [ ] Se connecter avec le compte 2
- [ ] Vérifier que les clients du compte 1 ne sont pas visibles
- [ ] Vérifier qu'il est impossible d'accéder/modifier/supprimer les clients du compte 1

### Test 22: Authentification requise
- [ ] Déconnecter l'utilisateur
- [ ] Essayer d'accéder à `/clients` → doit rediriger vers `/sign-in`
- [ ] Essayer d'accéder à `/clients/new` → doit rediriger vers `/sign-in`
- [ ] Essayer d'accéder à `/api/clients` → doit retourner 401

---

## Tests d'Erreurs et Edge Cases

### Test 23: Gestion d'erreurs réseau
- [ ] Simuler une erreur réseau (déconnecter la base de données)
- [ ] Essayer de créer un client → doit afficher un message d'erreur approprié
- [ ] Essayer de charger la liste → doit gérer l'erreur gracieusement

### Test 24: Champs optionnels
- [ ] Créer un client avec seulement Company Name (tous les autres champs vides)
- [ ] Vérifier que le client est créé avec succès
- [ ] Vérifier que les champs vides s'affichent comme "-" dans la liste

### Test 25: Longs textes
- [ ] Créer un client avec un Company Name très long
- [ ] Créer un client avec des Notes très longues
- [ ] Vérifier que l'affichage gère correctement les longs textes

---

## Checklist Finale

- [ ] Tous les tests ci-dessus passent
- [ ] Aucune erreur dans la console du navigateur
- [ ] Aucune erreur dans les logs du serveur
- [ ] Le code est propre et sans erreurs de linting
- [ ] La navigation fonctionne correctement entre toutes les pages
- [ ] L'application est responsive (mobile, tablette, desktop)
- [ ] Les messages de succès/erreur sont clairs et utiles

---

## Commandes utiles pour les tests

```bash
# Générer le client Prisma après modification du schéma
npm run db:generate

# Appliquer les migrations
npm run db:push
# OU
npm run db:migrate

# Ouvrir Prisma Studio pour inspecter la base de données
npm run db:studio

# Lancer le serveur de développement
npm run dev
```

---

**Note:** Si un test échoue, noter le problème et vérifier :
1. Les logs du serveur (terminal)
2. La console du navigateur (DevTools)
3. La base de données (Prisma Studio)
4. Les variables d'environnement


