<div align="center">

# OpenClassrooms - Eco-Bliss-Bath
</div>

<p align="center">
    <img src="https://img.shields.io/badge/MariaDB-v11.7.2-blue">
    <img src="https://img.shields.io/badge/Symfony-v6.2-blue">
    <img src="https://img.shields.io/badge/Angular-v13.3.0-blue">
    <img src="https://img.shields.io/badge/Cypress-v15.18.0-green">
    <img src="https://img.shields.io/badge/docker--build-passing-brightgreen">
  <br><br><br>
</p>

# Prérequis

- Docker
- Node.js

# Installation

Cloner le projet :
git clone https://github.com/GucciziMane/Eco-Bliss-Bath-V2.git
cd Eco-Bliss-Bath-V2

Lancer le backend et la base de données :
docker compose up -d

Installer les dépendances du frontend :
cd frontend
npm install

# Lancer l'application

Dans un premier terminal :
cd frontend
npm start

Attendre le message "Compiled successfully".

Le site est accessible sur `http://localhost:4200` et l'API sur `http://localhost:8081`.

# Lancer les tests

Dans un second terminal (garder le premier ouvert) :
cd frontend
npx cypress run

Pour ouvrir Cypress en mode graphique :
npx cypress open

# Rapport de tests

Les screenshots des tests en échec sont générés automatiquement dans `cypress/screenshots/` à chaque exécution.