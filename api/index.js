const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());

// Middleware de base pour logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// GET /credits - Obtenir tous les crédits
app.get('/credits', async (req, res) => {
  try {
    const credits = await prisma.credit.findMany();
    res.json(credits);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /credits - Créer un nouveau crédit
app.post('/credits', async (req, res) => {
  try {
    const { projectId, vintage, certifier, amount, owner } = req.body;
    
    const credit = await prisma.credit.create({
      data: {
        projectId,
        vintage,
        certifier,
        amount: parseFloat(amount),
        owner
      }
    });
    
    res.status(201).json(credit);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création' });
  }
});

// GET /users - Obtenir tous les utilisateurs
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        credits: true
      }
    });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /footprint/calculate - Calculer l'empreinte carbone
app.post('/footprint/calculate', async (req, res) => {
  try {
    const { wallet, energyConsumption, travel } = req.body;
    
    // Calcul simplifié de l'empreinte
    const energyFootprint = energyConsumption * 0.5; // Exemple: 0.5 kg CO2 par kWh
    const travelFootprint = (travel.car || 0) * 0.2 + (travel.plane || 0) * 0.25;
    const totalFootprint = (energyFootprint + travelFootprint) / 1000; // Conversion en tonnes
    
    // Chercher ou créer l'utilisateur
    let user = await prisma.user.findUnique({
      where: { wallet }
    });
    
    if (user) {
      user = await prisma.user.update({
        where: { wallet },
        data: { footprint: totalFootprint }
      });
    } else {
      user = await prisma.user.create({
        data: {
          wallet,
          footprint: totalFootprint
        }
      });
    }
    
    res.json({
      wallet,
      footprint: totalFootprint,
      recommendation: `Compensez ${totalFootprint.toFixed(2)} tonnes de CO2`
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de calcul' });
  }
});

// GET /user/:wallet - Obtenir les informations d'un utilisateur
app.get('/user/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { wallet },
      include: {
        credits: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`API CarbonTrack écoutant sur http://localhost:${port}`);
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('Exception non capturée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejet non géré à:', promise, 'raison:', reason);
});