import express from 'express';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import categorieRoutes from './routes/categorieRoutes.js';
import fournisseurRoutes from './routes/fournisseurRoutes.js';
import historiqueStockRoutes from './routes/historiqueStockRoutes.js';
import produitRoutes from './routes/produitRoutes.js';
import utilisateurRoutes from './routes/utilisateurRoutes.js';
import { getDashboard } from './controllers/HomeController.js';
import { renderLogin, loginUtilisateur } from './controllers/UtilisateurController.js';
import {
  connexion,
  seedReferenceData,
  syncDatabase,
} from './models/index.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'secret_session_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/fournisseurs', fournisseurRoutes);
app.use('/api/stock/historique', historiqueStockRoutes);
app.use('/api/produits', (req, res, next) => {
  req.url = `/api${req.url}`;
  next();
}, produitRoutes);
app.use('/api/utilisateurs', (req, res, next) => {
  req.url = `/api${req.url}`;
  next();
}, utilisateurRoutes);

app.get('/login', renderLogin);
app.post('/login', loginUtilisateur);
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});
app.get('/', getDashboard);
app.use('/produits', produitRoutes);
app.use('/utilisateurs', utilisateurRoutes);

const startDB = async () => {
  try {
    await connexion.authenticate();
    console.log('Connexion a la base de donnees reussie.');

    await syncDatabase({ alter: true });
    console.log('Toutes les tables sont synchronisees.');

    await seedReferenceData();
    console.log('Donnees de reference initialisees.');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Serveur lance sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur de demarrage complete :', error);
  }
};

startDB();
