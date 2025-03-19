import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Chemins des fichiers .env et .env.example
const envPath = path.resolve(process.cwd(), '.env');
const envExamplePath = path.resolve(process.cwd(), '.env.example');

try {
  // Vérifie si le fichier .env existe
  if (!fs.existsSync(envPath)) {
    console.error('Le fichier .env est introuvable.');
    process.exit(1);
  }

  // Charge les variables d'environnement depuis .env
  const envConfig = dotenv.parse(fs.readFileSync(envPath));

  // Génère le contenu de .env.example en supprimant les valeurs
  const exampleContent = Object.keys(envConfig)
    .map((key) => `${key}=`) // Conserve uniquement les clés
    .join('\n');

  // Écrit le fichier .env.example
  fs.writeFileSync(envExamplePath, exampleContent);

  console.log('.env.example a été généré avec succès.');
} catch (error) {
  console.error("Erreur lors de la génération de .env.example :", error.message);
}