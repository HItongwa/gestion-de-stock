#!/bin/bash

# Script de test du projet Gestion de Stock

echo "🚀 Démarrage des tests du projet Gestion de Stock"
echo ""

# Vérifier Node.js
echo "✓ Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js n'est pas installé. Veuillez installer Node.js"
    exit 1
fi
node --version
echo ""

# Vérifier npm
echo "✓ Vérification de npm..."
if ! command -v npm &> /dev/null; then
    echo "✗ npm n'est pas installé"
    exit 1
fi
npm --version
echo ""

# Vérifier MySQL
echo "✓ Vérification de MySQL..."
if ! command -v mysql &> /dev/null; then
    echo "⚠ MySQL n'est pas installé. Veuillez installer MySQL"
    exit 1
fi
mysql --version
echo ""

# Installer les dépendances
echo "✓ Installation des dépendances..."
npm install
echo ""

# Vérifier le fichier .env
echo "✓ Vérification du fichier .env..."
if [ ! -f .env ]; then
    echo "⚠ Fichier .env non trouvé. Création à partir du modèle..."
    cp .env.example .env
    echo "✓ Fichier .env créé. Veuillez vérifier les paramètres."
else
    echo "✓ Fichier .env trouvé"
fi
echo ""

# Vérifier les dossiers
echo "✓ Vérification des dossiers..."
required_dirs=("models" "controllers" "routes" "views" "middleware" "public")
for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✓ Dossier $dir existe"
    else
        echo "  ✗ Dossier $dir manquant"
    fi
done
echo ""

# Vérifier les fichiers principaux
echo "✓ Vérification des fichiers principaux..."
required_files=("index.js" "connexion.js" "package.json" "README.md")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ Fichier $file existe"
    else
        echo "  ✗ Fichier $file manquant"
    fi
done
echo ""

echo "✅ Tous les tests sont terminés!"
echo ""
echo "📝 Prochaines étapes:"
echo "1. Configurez les paramètres de .env (DB_HOST, DB_USER, etc.)"
echo "2. Créez la base de données: mysql -u root -p"
echo "3. Exécutez: CREATE DATABASE gestion_stock;"
echo "4. Démarrez le serveur: npm run dev"
echo "5. Accédez à http://localhost:5000"
echo ""
echo "Login par défaut:"
echo "Email: admin@gestionstock.local"
echo "Mot de passe: admin1234"
