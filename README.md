# Gestion de Stock — API Node/Express/Sequelize

## Démarrage rapide

```bash
npm install
# Configurer .env (DB_NAME, DB_USER, DB_PASSWORD)
npm start
```

Serveur : http://localhost:5000

## Structure du projet

```
gestion_stock/
├── index.js                    # Point d'entrée
├── connexion.js                # Config Sequelize
├── .env                        # Variables d'environnement
├── models/                     # Tables Sequelize
│   ├── Role.js
│   ├── Utilisateur.js
│   ├── Categorie.js
│   ├── Fournisseur.js
│   ├── Produit.js
│   └── HistoriqueStock.js
├── controllers/                # Logique métier
│   ├── AuthController.js       # Login JWT
│   ├── UtilisateurController.js
│   ├── ProduitController.js
│   ├── CategorieController.js
│   ├── FournisseurController.js
│   ├── HistoriqueStockController.js
│   └── HomeController.js
├── routes/                     # Routes Express
│   ├── authRoutes.js
│   ├── utilisateurRoutes.js
│   ├── produitRoutes.js
│   ├── categorieRoutes.js
│   ├── fournisseurRoutes.js
│   └── historiqueStockRoutes.js
├── middleware/
│   └── auth.js                 # isLogged (session) + authentification (JWT)
└── views/                      # Templates EJS
```

## Routes API REST (toutes protégées par JWT)

### Authentification
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/login` | Obtenir un token JWT |

### Catégories
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/categories?page=1&limit=10` | Liste paginée |
| GET | `/api/categories/:id` | Une catégorie |
| POST | `/api/categories` | Créer |
| PUT | `/api/categories/:id` | Modifier |
| DELETE | `/api/categories/:id` | Supprimer |

### Fournisseurs
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/fournisseurs?page=1&limit=10` | Liste paginée |
| GET | `/api/fournisseurs/:id` | Un fournisseur |
| POST | `/api/fournisseurs` | Créer |
| PUT | `/api/fournisseurs/:id` | Modifier |
| DELETE | `/api/fournisseurs/:id` | Supprimer |

### Produits
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/produits/api?page=1&limit=10` | Liste paginée |
| GET | `/api/produits/api/:id` | Un produit |
| POST | `/api/produits/api` | Créer |
| PUT | `/api/produits/api/:id` | Modifier |
| DELETE | `/api/produits/api/:id` | Supprimer |

### Utilisateurs
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/utilisateurs/api?page=1&limit=10` | Liste paginée |
| GET | `/api/utilisateurs/api/:id` | Un utilisateur |
| POST | `/api/utilisateurs/api` | Créer |
| PUT | `/api/utilisateurs/api/:id` | Modifier |
| DELETE | `/api/utilisateurs/api/:id` | Supprimer |

### Historique Stock
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/stock/historique?page=1&limit=10` | Tout l'historique |
| GET | `/api/stock/historique/produit/:id` | Historique d'un produit |
| POST | `/api/stock/historique` | Enregistrer un mouvement |

## Utilisation de l'API avec JWT

1. **Faire un POST** sur `/api/auth/login` avec email/motDePasse
2. **Copier le token** reçu dans la réponse
3. **Ajouter dans chaque requête** le header : `Authorization: Bearer <token>`

## Frontend EJS (protégé par session)

- `GET /` — Dashboard
- `GET /login` — Page de connexion
- `GET /produits` — Liste des produits
- `GET /utilisateurs` — Liste des utilisateurs
