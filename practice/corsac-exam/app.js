'use strict';

//Packages
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors')

//App
const app = express();
app.use(cors())
app.use(bodyParser.json());

app.use('/', express.static('./public'));

//SQL database
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'spaceship',
});

//connection
conn.connect((err) => {
  if (err) {throw err;
  } else {
    console.log('Connected to mySQL!');
  }
});

//Frontend endpoint
app.get('/', cors(), function (req, res) {
  res.sendFile(__dirname, '/public/index.html');
});

//headers
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


//API endpoints
//planets endpoint
app.get('/planets', cors(), function (req, res) {
  conn.query(`SELECT * FROM spaceship, planet`, function (err, rows) {
    if (err) {
      throw err;
    } else {
      res.json(rows)
    }
  })
})

//movehere endpoint
app.post('/movehere/:planet_id', cors(), function (req, res) {
  conn.query(`SELECT name FROM planet WHERE id=${req.params.planet_id}`, function (err, planetNameRows) {
    conn.query(`SELECT planet FROM spaceship`, function (err, planetOfShipRows) {
      //Request validation
      if (planetNameRows[0].name === planetOfShipRows[0].planet) {
        res.json({
          result: 'The ship is already on the requested planet.'
        })
      } else {
          conn.query(`UPDATE spaceship SET planet = (SELECT name FROM planet WHERE id=${req.params.planet_id});`, function (err, rows) {
            res.json(rows)
        })
      }
    }) 
  })
})

//toplanet endpoint
app.post('/toplanet/:planet_id', cors(), function (req, res) {
   //select number of people on ship
  conn.query(`SELECT utilization FROM spaceship`, function (err, spaceshipRows) {
     //select number of people on planet
      conn.query(`SELECT population FROM planet WHERE id=${req.params.planet_id}`, function (err, planetRows) {
          if (spaceshipRows[0].utilization > 0) {
             //update number of people on ship if there was at least one person on it
            conn.query(`UPDATE spaceship SET utilization = 0;`, function (err, rows) {
            let newPopulation = spaceshipRows[0].utilization + planetRows[0].population;
             //update number of people on planet if there was at least one person on the ship
            conn.query(`UPDATE planet SET population = ${newPopulation} WHERE id=${req.params.planet_id};`, function (err, rows) {
              //error handling
              if (err) {
                throw err;
              } else {
                res.json({
                  result: 'success'
                })
              }
            })
          })
        } else {
          res.json({
            result: 'Sorry, the ship is empty!'
          })
        }
      })
    })
  })

//toship endpoint
app.post('/toship/:planet_id', cors(), function (req, res) {
  //select number of people on ship
  conn.query(`SELECT utilization FROM spaceship`, function (err, spaceshipRows) {
     //select number of people on planet
    conn.query(`SELECT population FROM planet WHERE id=${req.params.planet_id}`, function (err, planetRows) {
      if (spaceshipRows[0].utilization < 60) {
        if (planetRows[0].population > 0) {
          let freeSpacesOnShip = 60 - spaceshipRows[0].utilization;
          let passangerCount;
          if (planetRows[0].population - freeSpacesOnShip < 0) {
            passangerCount = planetRows[0].population
          } else {
            passangerCount = freeSpacesOnShip;
          }
          let newPopulation = planetRows[0].population - passangerCount;
          let newUtilization = spaceshipRows[0].utilization + passangerCount;
           //update number of people on ship
          conn.query(`UPDATE spaceship SET utilization = ${newUtilization};`, function (err, rows) {
             //update number of people on ship
            conn.query(`UPDATE planet SET population = ${newPopulation} WHERE id=${req.params.planet_id};`, function (err, rows) {
              //error handling
              if (err) {
                throw err;
              } else {
                res.json({
                  result: 'success'
                })
              }
            })
          })
        }
      }  else {
        res.json({
          result: 'Sorry, the ship has reached it\'s maximum capacity!'
        })
      }
    })
  })
})

//Run App
app.listen(8080, () => {
  console.log('the app is running');
});