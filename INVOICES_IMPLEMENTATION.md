# Implémentation Invoices CRUD - Récapitulatif

## Fichiers modifiés/créés

### Schéma Prisma
- ✅ **prisma/schema.prisma** - Mis à jour :
  - `taxPercentage` → `taxRate`
  - `totalAmount` → `total`
  - `quantity` en Decimal(10, 3) au lieu de Decimal(10, 2)
  - Ajout de `createdAt`/`updatedAt` sur InvoiceLineItem
  - Ajout des index sur `userId`, `clientId`, `status`

### Routes API
- ✅ **app/api/invoices/route.ts** - POST (création), GET (liste avec filtres)
- ✅ **app/api/invoices/[id]/route.ts** - GET (détail), PATCH (mise à jour), DELETE (suppression)
- ✅ **app/api/invoices/[id]/status/route.ts** - PATCH (changement de statut)
- ✅ **app/api/invoices/next-number/route.ts** - GET (suggestion de numéro)

### Pages
- ✅ **app/invoices/page.tsx** - Liste des factures avec filtres
- ✅ **app/invoices/new/page.tsx** - Création de facture (avec vérification profil complet)
- ✅ **app/invoices/[id]/page.tsx** - Détail d'une facture
- ✅ **app/invoices/[id]/edit/page.tsx** - Édition de facture (avec warning si SENT/PAID)

### Composants
- ✅ **components/StatusBadge.tsx** - Badge de statut coloré
- ✅ **components/InvoiceTotalsDisplay.tsx** - Affichage des totaux avec calcul taxe
- ✅ **components/LineItemRow.tsx** - Ligne de facture avec calculs temps réel
- ✅ **components/DeleteInvoiceModal.tsx** - Modal de confirmation de suppression
- ✅ **components/InvoicesTable.tsx** - Tableau responsive des factures
- ✅ **components/InvoiceForm.tsx** - Formulaire complet avec calculs temps réel
- ✅ **components/InvoiceFormWrapper.tsx** - Wrapper pour gérer la soumission
- ✅ **components/InvoiceDetailView.tsx** - Vue détaillée d'une facture
- ✅ **components/InvoicesPageClient.tsx** - Client component pour la liste

### Utilitaires
- ✅ **lib/invoice-calculations.ts** - Fonctions de calcul (lineTotal, subtotal, taxAmount, total)

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
# Nommez la migration : update_invoice_schema
```

### 3. Lancer l'application
```bash
npm run dev
```

## URLs à tester

### Pages principales
1. **`http://localhost:3000/invoices`**
   - Liste des factures avec filtres par statut
   - Tri par date d'émission (plus récent en premier)
   - Actions: View, Edit, Delete

2. **`http://localhost:3000/invoices/new`**
   - Création de facture
   - Doit rediriger vers `/company/edit` si profil incomplet
   - Formulaire avec calculs temps réel
   - Suggestion automatique de numéro de facture

3. **`http://localhost:3000/invoices/[id]`**
   - Détail d'une facture
   - Affichage complet avec company/client info
   - Changement de statut via dropdown
   - Badge OVERDUE si due date passée et status != PAID

4. **`http://localhost:3000/invoices/[id]/edit`**
   - Édition de facture
   - Warning si status = SENT ou PAID
   - Formulaire pré-rempli avec calculs temps réel

### Routes API
5. **`POST http://localhost:3000/api/invoices`** - Création
6. **`GET http://localhost:3000/api/invoices?status=DRAFT`** - Liste avec filtre
7. **`GET http://localhost:3000/api/invoices/[id]`** - Détail
8. **`PATCH http://localhost:3000/api/invoices/[id]`** - Mise à jour
9. **`PATCH http://localhost:3000/api/invoices/[id]/status`** - Changement de statut
10. **`DELETE http://localhost:3000/api/invoices/[id]`** - Suppression
11. **`GET http://localhost:3000/api/invoices/next-number`** - Suggestion de numéro

## Scénario de test complet

### Prérequis
- ✅ Utilisateur authentifié
- ✅ Company Profile complet
- ✅ Au moins un client créé

### Étape 1 : Créer un client
1. Aller sur `/clients/new`
2. Remplir le formulaire :
   - Company Name: "Test Client Inc."
   - Contact Person: "John Doe"
   - Email: "john@testclient.com"
   - Street Address: "123 Client St"
   - City: "Paris"
   - Postal Code: "75001"
   - Country: "France"
3. Cliquer sur "Save Client"
4. Vérifier que le client apparaît dans `/clients`

### Étape 2 : Créer une facture
1. Aller sur `/invoices/new`
2. Vérifier que le formulaire s'affiche avec :
   - Client sélectionnable (dropdown avec "Test Client Inc.")
   - Invoice Number pré-rempli (ex: "INV-001")
   - Issue Date = aujourd'hui
   - Due Date = dans 30 jours
3. Remplir le formulaire :
   - Client: Sélectionner "Test Client Inc."
   - Invoice Number: "INV-001" (ou laisser la suggestion)
   - Ajouter un line item :
     - Description: "Web Development Services"
     - Quantity: 10
     - Unit Price: 100.00
     - Vérifier que Line Total = 1000.00 (calcul temps réel)
   - Tax Rate: 20
   - Vérifier les totaux :
     - Subtotal: 1000.00
     - Tax (20%): 200.00
     - Total: 1200.00
   - Notes: "Payment due within 30 days"
   - Status: Draft
4. Cliquer sur "Save"
5. Vérifier la redirection vers `/invoices/[id]` (page détail)
6. Vérifier que la facture s'affiche correctement avec tous les détails

### Étape 3 : Modifier la facture
1. Depuis la page détail, cliquer sur "Edit"
2. Vérifier que le formulaire est pré-rempli
3. Modifier :
   - Ajouter un deuxième line item :
     - Description: "Consulting Services"
     - Quantity: 5
     - Unit Price: 150.00
   - Modifier le premier line item :
     - Quantity: 15 (au lieu de 10)
   - Vérifier les nouveaux totaux :
     - Subtotal: 2250.00 (15×100 + 5×150)
     - Tax (20%): 450.00
     - Total: 2700.00
4. Cliquer sur "Save Changes"
5. Vérifier la redirection vers la page détail
6. Vérifier que les modifications sont sauvegardées

### Étape 4 : Changer le statut
1. Depuis la page détail, utiliser le dropdown "Change Status"
2. Sélectionner "Mark as Sent"
3. Vérifier que le statut change et le badge devient bleu (SENT)
4. Sélectionner "Mark as Paid"
5. Vérifier que le statut change et le badge devient vert (PAID)
6. Vérifier que le badge OVERDUE disparaît (si présent)

### Étape 5 : Tester l'édition avec statut SENT/PAID
1. Depuis la page détail (statut PAID), cliquer sur "Edit"
2. Vérifier qu'un warning jaune s'affiche :
   "⚠ This invoice has been marked as PAID. Editing it may cause confusion."
3. Modifier un line item
4. Sauvegarder
5. Vérifier que les modifications sont bien sauvegardées (pas de blocage)

### Étape 6 : Tester les filtres
1. Aller sur `/invoices`
2. Vérifier que toutes les factures s'affichent
3. Sélectionner "Draft" dans le filtre
4. Vérifier que seules les factures DRAFT s'affichent
5. Sélectionner "Paid"
6. Vérifier que seules les factures PAID s'affichent

### Étape 7 : Supprimer une facture
1. Depuis `/invoices`, cliquer sur "Delete" d'une facture
2. Vérifier que la modal de confirmation s'affiche :
   "Are you sure you want to delete invoice [number]? This action cannot be undone."
3. Cliquer sur "Delete"
4. Vérifier que la facture disparaît de la liste
5. Vérifier le message de succès

### Étape 8 : Tester l'unicité du numéro
1. Créer une nouvelle facture avec le numéro "INV-001"
2. Vérifier que ça fonctionne
3. Essayer de créer une autre facture avec le même numéro "INV-001"
4. Vérifier l'erreur : "This invoice number is already in use" (409)

### Étape 9 : Tester la protection profil incomplet
1. (Optionnel) Modifier temporairement le profil pour le rendre incomplet
2. Essayer d'accéder à `/invoices/new`
3. Vérifier la redirection vers `/company/edit`

### Étape 10 : Tester l'isolation des données
1. Créer un deuxième compte utilisateur
2. Se connecter avec ce compte
3. Vérifier que les factures du premier compte ne sont pas visibles
4. Essayer d'accéder à `/invoices/[id-du-premier-compte]`
5. Vérifier la redirection vers `/invoices` (404)

## Points de vérification importants

- ✅ **Calculs** : Vérifier que tous les calculs sont corrects (lineTotal, subtotal, taxAmount, total)
- ✅ **Temps réel** : Les calculs se mettent à jour en temps réel lors de la saisie
- ✅ **Validation** : Les erreurs s'affichent inline (client requis, invoice number requis, etc.)
- ✅ **Sécurité** : Un utilisateur ne voit que ses propres factures
- ✅ **Unicité** : Le numéro de facture est unique par utilisateur
- ✅ **Statuts** : Toutes les transitions de statut fonctionnent
- ✅ **Responsive** : Le tableau devient des cartes sur mobile
- ✅ **Badge OVERDUE** : S'affiche si due date passée et status != PAID

## Notes importantes

- **Calculs** : Tous les calculs sont effectués côté serveur avec Decimal pour la précision
- **Line Items** : Approche replace complète lors de l'édition (suppression + recréation)
- **Statuts** : Pas de workflow strict, toutes les transitions sont possibles
- **Numérotation** : Suggestion automatique basée sur le dernier numéro, mais l'utilisateur peut modifier
- **Dates** : Stockées en UTC, affichées dans le timezone local
- **Profil complet** : Vérification avant création de facture, redirection si incomplet


