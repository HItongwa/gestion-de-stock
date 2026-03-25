import { testDatabaseConnection } from '../connexion.js';
import {
  getDatabaseHealth,
  seedReferenceData,
  syncDatabase,
} from '../models/index.js';

const run = async () => {
  try {
    await testDatabaseConnection();
    console.log('Connexion MySQL reussie.');

    await syncDatabase({ alter: true });
    console.log('Synchronisation des tables terminee.');

    await seedReferenceData();
    console.log('Donnees de reference verifiees.');

    const health = await getDatabaseHealth();
    console.log('Etat des donnees:', health);
  } catch (error) {
    console.error('Verification BD echouee:', error.message);
    process.exitCode = 1;
  }
};

run();
