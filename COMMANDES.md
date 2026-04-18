# Commandes Utiles - Gestion de Stock

## 🚀 Installation et Démarrage

### Installation initiale
```bash
npm install
cp .env.example .env
# Éditer .env avec vos paramètres
```

### Démarrage
```bash
# Mode développement (avec auto-reload)
npm run dev

# Mode production
npm start
```

### Vérification de la base de données
```bash
npm run db:check
```

## 🗄️ Gestion de la Base de Données

### Créer la base de données
```bash
mysql -u root -p
CREATE DATABASE gestion_stock;
EXIT;
```

### Accéder à la base de données
```bash
mysql -u root -p gestion_stock
```

### Voir les tables
```sql
SHOW TABLES;
DESCRIBE utilisateurs;
DESCRIBE produits;
```

### Vider la base de données (dangereux!)
```sql
DROP DATABASE gestion_stock;
CREATE DATABASE gestion_stock;
```

## 👤 Gestion des Utilisateurs

### Créer un nouvel utilisateur par défaut
```sql
-- Dans MySQL
INSERT INTO roles (nom) VALUES ('Admin');

INSERT INTO utilisateurs (nom, prenom, email, motDePasse, roleId, createdAt, updatedAt) 
VALUES (
    'Admin', 
    'Système', 
    'admin@test.com',
    '$2b$10$...', -- Hash bcrypt (10 rounds)
    1,
    NOW(),
    NOW()
);
```

### Réinitialiser le mot de passe admin
- Se connecter à l'admin
- Aller dans la section Utilisateurs
- Modifier l'utilisateur et entrer un nouveau mot de passe

## 🔑 Variables d'Environnement

```env
# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_password
DB_NAME=gestion_stock
DB_DIALECT=mysql
DB_PORT=3306

# Serveur
PORT=5000

# Sécurité
SESSION_SECRET=changez_ceci_en_production
JWT_SECRET=changez_ceci_en_production

# Environnement
NODE_ENV=development  # ou 'production'
```

## 🧪 Tests

### Vérifier la structure du projet
```bash
ls -la models/
ls -la controllers/
ls -la routes/
ls -la views/
```

### Tester la connexion à la base de données
```bash
npm run db:check
```

### Voir les logs en temps réel
```bash
npm run dev 2>&1 | tee app.log
```

## 📝 Git - Commandes

### Initialiser Git
```bash
git init
git add .
git commit -m "Initial commit - Gestion de Stock"
```

### Créer une branche
```bash
git checkout -b feature/nom-de-la-fonctionalité
git add .
git commit -m "Ajouter: description"
git push origin feature/nom-de-la-fonctionalité
```

### Voir l'historique
```bash
git log --oneline
git log --graph --all
```

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier les dépendances
npm install

# Vérifier le port 5000
lsof -i :5000
# Tuer le processus si nécessaire
kill -9 <PID>
```

### Erreur de connexion à la base de données
```bash
# Vérifier que MySQL est en cours d'exécution
mysql -u root -p

# Vérifier les paramètres dans .env
cat .env

# Vérifier la base de données existe
mysql -u root -p -e "SHOW DATABASES;"
```

### Problème de session
```bash
# Supprimer les sessions (redémarrer)
npm run dev

# Nettoyer le cache navigateur
# Vider les cookies et les données du site
```

## 📊 Performance

### Optimiser la base de données
```sql
-- Ajouter des index
CREATE INDEX idx_utilisateur_email ON utilisateurs(email);
CREATE INDEX idx_produit_sku ON produits(sku);
CREATE INDEX idx_historique_produit ON historique_stock(produitId);
```

### Monitorage
```bash
# CPU et mémoire
node --max-old-space-size=2048 index.js
```

## 🔒 Sécurité en Production

### Checklist de sécurité
- [ ] Changer SESSION_SECRET et JWT_SECRET
- [ ] Utiliser HTTPS (certificat SSL)
- [ ] Configurer les headers de sécurité
- [ ] Limiter les requêtes (rate limiting)
- [ ] Activer CORS correctement
- [ ] Faire des sauvegardes régulières
- [ ] Monitorer les logs

### Ajouter CORS
```javascript
import cors from 'cors';
app.use(cors({
    origin: 'https://votredomaine.com',
    credentials: true
}));
```

## 📱 Déploiement

### Sur Heroku
```bash
# Installer Heroku CLI
npm install -g heroku

# Se connecter
heroku login

# Créer une app
heroku create gestion-stock

# Configurer les variables
heroku config:set DB_HOST=votre_db
heroku config:set DB_USER=votre_user

# Déployer
git push heroku main

# Voir les logs
heroku logs --tail
```

### Sur Render
1. Connecter le repository GitHub
2. Créer une nouvelle Web Service
3. Configurer les variables d'environnement
4. Configurer la base de données MySQL (Clever Cloud)
5. Déployer

### Sur Railway
1. Connexion avec GitHub
2. Import du projet
3. Ajouter MySQL
4. Configurer .env
5. Déployer

## 📞 Support

### Documentation officielle
- Express: https://expressjs.com
- Sequelize: https://sequelize.org
- EJS: https://ejs.co
- Bootstrap: https://getbootstrap.com

### Contacts
- Auteur: HItongwa
- Repository: https://github.com/HItongwa/gestion-de-stock
- Email: support@example.com

---

**Dernière mise à jour**: 17 avril 2025
