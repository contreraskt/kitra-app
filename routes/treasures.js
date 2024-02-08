const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const knex = require('knex');
dotenv.config();

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

router.use(bodyParser.json());

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// API Endpoints
    //all treasures
router.get('/treasures', async (req, res) => {
    try {
      const allTreasures = await db('treasures').select('*');
      res.json({ treasures: allTreasures });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  });
  
  // treasure by id
router.get('/treasures/:id', async (req, res) => {
    const treasureId = req.params.id;
  
    try {
      const treasure = await db('treasures').where('id', treasureId).first();
  
      if (treasure) {
        res.json({ treasure });
      } else {
        res.status(404).json({ error: 'Treasure not found.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  });


router.get('/find-treasures', async (req, res) => {
    const { latitude, longitude, distance, prizeValue } = req.query;
  
    // Validations
    if (!latitude || !longitude || !distance) {
      return res.status(400).json({ error: 'Latitude, longitude, and distance are required.' });
    }
  
    const validDistances = ['1km', '10km'];
    if (!validDistances.includes(distance)) {
      return res.status(400).json({ error: 'Invalid distance value. Accepted values are 1km or 10km.' });
    }
  
    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);
  
    if (isNaN(userLat) || isNaN(userLng)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude value.' });
    }
  
    try {
        const treasures = await db('treasures')
          .select('treasures.*')
          .distinct('treasures.id')
          .leftJoin('money_values', 'treasures.id', '=', 'money_values.treasure_id');
    
        const filteredTreasures = treasures.filter(async (treasure) => {
          const treasureDistance = calculateDistance(userLat, userLng, treasure.latitude, treasure.longitude);
            
          //if got prizevalue
          if (prizeValue) {
            const validPrizeValues = await db('money_values')
              .where('treasure_id', treasure.id)
              .select('amt')
              .whereBetween('amt', [10, 30]);
    
            if (validPrizeValues.length > 0) {
              const minPrizeValue = Math.min(...validPrizeValues.map(value => value.amt));
    
              return treasureDistance <= (distance === '1km' ? 1 : 10) && minPrizeValue !== undefined;
            } else {
              return false;
            }
          } else {
            return treasureDistance <= (distance === '1km' ? 1 : 10);
          }
        });
    
        res.json({ treasures: filteredTreasures });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error.' });
      }
  });
  
 
module.exports = router;
