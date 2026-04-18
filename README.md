# 📦 Gestion de Stock

Application web complète de gestion de stock avec Node.js/Express et MySQL.

## 🎯 Fonctionnalités

- ✅ **Authentification et Autorisations** - Système de rôles (Admin, Utilisateur)
- ✅ **Gestion des Produits** - Ajouter, modifier, supprimer des produits avec SKU unique
- ✅ **Gestion des Utilisateurs** - Gestion complète des comptes utilisateurs
- ✅ **Gestion des Catégories** - Organisation des produits par catégorie
- ✅ **Gestion des Fournisseurs** - Suivi des contacts fournisseurs
- ✅ **Historique de Stock** - Traçabilité complète avec pagination
- ✅ **Dashboard** - Vue d'ensemble des statistiques en temps réel
- ✅ **Validations** - Validation côté client et serveur
- ✅ **Design Responsive** - Interface adaptée à tous les écrans avec Bootstrap 5

## 📋 Prérequis

- Node.js (v14+)
- MySQL (v5.7+)
- npm ou yarn

## 🚀 Installation

### 1. Cloner le repository
```bash
git clone https://github.com/HItongwa/gestion-de-stock.git
cd gestion_stock
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement
```bash
cp .env.example .env
```

Éditer le fichier `.env` avec vos paramètres :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_password
DB_NAME=gestion_stock
DB_DIALECT=mysql
DB_PORT=3306
PORT=5000
SESSION_SECRET=votre_secret_session
JWT_SECRET=votre_secret_jwt
```

### 4. Créer la base de données
```bash
mysql -u root -p
CREATE DATABASE gestion_stock;
EXIT;
```

### 5. Démarrer le serveur
```bash
npm run dev
```

Le serveur sera accessible à **http://localhost:5000**

## 📖 Utilisation

### Identifiants par défaut
- **Email** : admin@gestionstock.local
- **Mot de passe** : admin1234

## 📁 Structure du projet

```
gestion_stock/
├── controllers/                 # Logique métier
│   ├── HomeController.js
│   ├── UtilisateurController.js
│   ├── ProduitController.js
│   ├── CategorieController.js
│   └── FournisseurController.js
├── models/                      # Modèles Sequelize
│   ├── Role.js
│   ├── Utilisateur.js
│   ├── Categorie.js
│   ├── Fournisseur.js
│   ├── Produit.js
│   ├── HistoriqueStock.js
│   └── index.js
├── routes/                      # Routes Express
│   ├── authRoutes.js
│   ├── utilisateurRoutes.js
│   ├── produitRoutes.js
│   ├── categorieRoutes.js
│   ├── fournisseurRoutes.js
│   └── historiqueStockRoutes.js
├── middleware/
│   └── auth.js                  # Authentification et autorisations
├── views/                       # Templates EJS
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── produits/
│   ├── utilisateurs/
│   ├── categories/
│   ├── fournisseurs/
│   ├── historique/
│   ├── index.ejs               # Dashboard
│   └── login.ejs               # Page de connexion
├── public/                      # Assets statiques
├── index.js                     # Point d'entrée
├── connexion.js                 # Configuration Sequelize
└── package.json
```

## 🔒 Sécurité

- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ Authentification par session Express
- ✅ Validation des formulaires avec express-validator
- ✅ Protection contre les SQL injection (Sequelize)
- ✅ Contrôle d'accès par rôle

## 📊 Modèles de données

### Role
- id (PK)
- nom (Admin, Utilisateur)

### Utilisateur
- id (PK)
- nom, prenom
- email (unique)
- motDePasse (hashé)
- roleId (FK)
- actif (booléen)

### Produit
- id (PK)
- nom, description
- sku (unique)
- prix, quantité
- quantiteMin
- categorieId (FK)
- fournisseurId (FK)
- actif

### Catégorie
- id (PK)
- nom (unique)
- description

### Fournisseur
- id (PK)
- nom
- contactEmail
- telephone, adresse

### HistoriqueStock
- id (PK)
- produitId (FK)
- utilisateurId (FK)
- type (entree, sortie, ajustement)
- quantite
- ancienneQuantite, nouvelleQuantite
- raison

## 🛣️ Routes Web (Rendus EJS)

### Authentification
- `GET /login` - Page de connexion
- `POST /login` - Traitement du formulaire
- `GET /logout` - Déconnexion

### Dashboard
- `GET /` - Tableau de bord (protégé)

### Produits
- `GET /produits` - Liste
- `GET /produits/add` - Formulaire ajout
- `POST /produits` - Créer
- `GET /produits/:id/edit` - Formulaire modification
- `POST /produits/:id` - Modifier
- `DELETE /produits/:id` - Supprimer

### Utilisateurs
- `GET /utilisateurs` - Liste
- `GET /utilisateurs/add` - Formulaire ajout
- `POST /utilisateurs` - Créer
- `GET /utilisateurs/:id/edit` - Formulaire modification
- `POST /utilisateurs/:id` - Modifier
- `DELETE /utilisateurs/:id` - Supprimer

### Catégories
- `GET /categories` - Liste
- `GET /categories/add` - Formulaire ajout
- `POST /categories` - Créer
- `GET /categories/:id/edit` - Formulaire modification
- `POST /categories/:id` - Modifier
- `DELETE /categories/:id` - Supprimer

### Fournisseurs
- `GET /fournisseurs` - Liste
- `GET /fournisseurs/add` - Formulaire ajout
- `POST /fournisseurs` - Créer
- `GET /fournisseurs/:id/edit` - Formulaire modification
- `POST /fournisseurs/:id` - Modifier
- `DELETE /fournisseurs/:id` - Supprimer

### Historique
- `GET /api/stock/historique?page=1` - Historique avec pagination

## 🧪 Commandes

```bash
# Développement avec auto-reload
npm run dev

# Démarrage normal
npm start

# Vérification de la base de données
npm run db:check
```

## 🎨 Technologies

- **Backend** : Node.js, Express 5
- **Base de données** : MySQL, Sequelize ORM
- **Frontend** : EJS, Bootstrap 5, Font Awesome
- **Authentification** : bcrypt, express-session
- **Validation** : express-validator
- **Environnement** : dotenv

## 📝 Exemple d'utilisation - Créer un produit

1. Se connecter avec l'admin
2. Naviguer vers "Produits"
3. Cliquer sur "Ajouter un produit"
4. Remplir le formulaire :
   - Nom, Description
   - SKU unique (ex: PROD001)
   - Sélectionner Catégorie et Fournisseur
   - Entrer Prix et Quantité initiale
   - Définir la Quantité minimum d'alerte
5. Cliquer sur "Ajouter"
6. Un mouvement "Entrée" est automatiquement enregistré dans l'historique

## 🚀 Déploiement

### Préparation
1. Créer un fichier `.env` de production
2. Vérifier les variables d'environnement
3. Tester en local : `NODE_ENV=production npm start`

### Plateforme recommandée
- Heroku, Railway, Render (hosting gratuit)
- Utiliser un service de base de données managé (Clever Cloud, AWS RDS)

## 📄 License

ISC

## 👤 Auteur

HItongwa

## 🤝 Contribution

Les contributions sont bienvenues ! N'hésitez pas à créer une branche et soumettre une PR.

## 📧 Support

Pour toute question ou problème, ouvrez une issue sur le repository.

---

**Dernière mise à jour** : Avril 2025
3. **Ajouter dans chaque requête** le header : `Authorization: Bearer <token>`

## Frontend EJS (protégé par session)

- `GET /` — Dashboard
- `GET /login` — Page de connexion
- `GET /produits` — Liste des produits
- `GET /utilisateurs` — Liste des utilisateurs
