const express = require('express');
const encryptLib = require('../modules/encryption');
const userStrategy = require('../strategies/sql.localstrategy');
const pool = require('../modules/pool.js');
const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', (req, res) => {
  // check if logged in
  if (req.isAuthenticated()) {
    // send back user object from database
    res.send(req.user);
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const city = req.body.city;
  const state = req.body.state;

  var saveUser = {
    username: req.body.username,
    password: encryptLib.encryptPassword(req.body.password),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    city: req.body.city,
    state: req.body.state
  };
  // console.log('new user:', saveUser);
  pool.query(
    `INSERT INTO users
    (username,
      password,
      first_name,
      last_name,
      city,
      state)
      VALUES
      ($1, $2, $3, $4, $5, $6)
      RETURNING id`,
    [
      saveUser.username,
      saveUser.password,
      saveUser.first_name,
      saveUser.last_name,
      saveUser.city,
      saveUser.state
    ],
    (err, result) => {
      if (err) {
        // console.log("Error inserting data: ", err);
        res.sendStatus(500);
      } else {
        res.sendStatus(201);
      }
    }
  );
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.get('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

/*
 **********************************
 ***********LOGIC ROUTES***********
 **********************************
 */

/***********************************
Get data from dB for user catch table
 ********************************* */
router.get('/events', (req, res) => {
  // query DB
  if (req.isAuthenticated()) {
    const queryText = `SELECT
    eventid,
    date,
    userid,
    species,
    event_city,
    event_state,
    rod,
    reel,
    tackle_bait,
    body_of_water,
    lat,
    lon,
    image_url
    FROM
    events
    JOIN
    users on users.id = events.userid
    WHERE users.id =$1
    ORDER BY date ASC;`;
    pool
      .query(queryText, [req.user.id])
      // runs on successful query
      .then(result => {
        // console.log('query results', result);
        // console.log(eventid);
        res.send(result.rows);
      })
      // error handling
      .catch(err => {
        // console.log('error making select query:', err);
        res.sendStatus(500);
      });
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
});

/***********************************
****ADD ITEM TO USER CATCH TABLE****
 ***********************************
Insert catch data into table */
router.post('/addItem', function(req, res) {
  // console.log('in POST router');
  if (req.isAuthenticated()) {
    //add catch event to user data table
    const queryText = `INSERT INTO events
    (date,
      event_city,
      event_state,
      userid,
      species,
      rod,
      reel, 
      tackle_bait, 
      body_of_water,
      lat,
      lon,
      image_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
    pool
      .query(queryText, [
        req.body.date,
        req.body.event_city,
        req.body.event_state,
        req.user.id,
        req.body.species,
        req.body.rod,
        req.body.reel,
        req.body.tackle_bait,
        req.body.body_of_water,
        req.body.lat,
        req.body.lon,
        req.body.image_url
      ])
      .then(result => {
        // console.log('result:', result);
        res.send(result);
      })
      // erorr handling
      .catch(err => {
        // console.log('error:', err);
        res.sendStatus(500);
      });
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
});

/* *******************************
**********SAVE CATCH EDIT*********
saving data from edit catch view form back to database */
router.put('/saveCatchEdit', (req, res) => {
  if (req.isAuthenticated()) {
    // console.log('in saveCatchEdit router');
    const queryText = `UPDATE events SET
    date = $1,
    event_city = $2,
    event_state = $3,
    species = $4,
    rod = $5,
    reel = $6,
    tackle_bait = $7,
    body_of_water = $8
    WHERE eventid = $9`;
    pool
      .query(queryText, [
        req.body.item.date,
        req.body.item.event_city,
        req.body.item.event_state,
        req.body.item.species,
        req.body.item.rod,
        req.body.item.reel,
        req.body.item.tackle_bait,
        req.body.item.body_of_water,
        req.body.item.eventid
      ])
      .then(result => {
        // console.log('result:', result);
        res.send(result);
      })
      .catch(err => {
        // console.log('error:', err);
        res.sendStatus(500);
      });
  }
}); //end saving data

/* *******************************
**********SAVE USER INFO**********
saving data from updating user data to database */
router.put('/saveUserInfo', (req, res) => {
  if (req.isAuthenticated()) {
    // console.log('in saveUserInfo router');
    const queryText = `UPDATE users SET
    username = $1,
    first_name = $2,
    last_name = $3,
    city = $4,
    state = $5
    WHERE id = $6`;
    pool
      .query(queryText, [
        req.body.username,
        req.body.first_name,
        req.body.last_name,
        req.body.city,
        req.body.state,
        req.user.id
      ])
      .then(result => {
        // console.log('result:', result);
        res.send(result.rows);
      })
      .catch(err => {
        // console.log('error:', err);
        res.sendStatus(500);
      });
  }
}); //end saving data

/* ***************************
**********EDIT CATCH**********
******************************
getting data from database for edit catch view form */
router.get('/editCatch', function(req, res) {
  if (isAuthenticated()) {
    // console.log('in get event');
    const queryText = `SELECT
    date,
    event_city,
    event_state,
    species,
    tackle_bait,
    rod,
    reel,
    body_of_water
    FROM events
    WHERE eventid = $1`;
    pool
      .query(queryText, [req.params.id])
      .then(result => {
        // console.log('query results:', result);
        res.send(result);
      })
      .catch(err => {
        // console.log('error making query:', err);
        res.sendStatus(500);
      });
  }
}); //end getting data for edit catch view form

/* ***************************
*******DELETE CATCH ROW*******
******************************
delete table/database row */
router.delete('/deleteItem/:eventid', function(req, res) {
  // console.log('in router.delete');
  const queryText = 'DELETE FROM events WHERE eventid = $1';
  pool
    .query(queryText, [req.params.eventid])
    .then(result => {
      // console.log('result:', result.rows);
      res.sendStatus(200);
    })
    .catch(err => {
      // console.log('error:', err);
      res.sendStatus(500);
    });
}); //end delete row
module.exports = router;
