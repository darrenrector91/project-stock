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
  const name = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  const email = req.body.email;

  var saveUser = {
    name: req.body.username,
    password: encryptLib.encryptPassword(req.body.password),
    email: req.body.email
  };
  // console.log('new user:', saveUser);
  pool.query(
    `INSERT INTO users
    (username,
      password,
      email)
      VALUES
      ($1, $2, $3)
      RETURNING id`,
    [saveUser.name, saveUser.password, saveUser.email],
    (err, result) => {
      if (err) {
        console.log('Error inserting data: ', err);
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

router.get('/categories', (req, res) => {
  // query DB
  if (req.isAuthenticated()) {
    const queryText = `SELECT name FROM categories`;
    pool
      .query(queryText)
      // runs on successful query
      .then(result => {
        console.log('query results', result);
        res.send(result.rows);
      })
      // error handling
      .catch(err => {
        console.log('error making select query:', err);
        res.sendStatus(500);
      });
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
});

router.get('/locations', (req, res) => {
  // query DB
  if (req.isAuthenticated()) {
    const queryText = `SELECT name FROM locations`;
    pool
      .query(queryText)
      // runs on successful query
      .then(result => {
        res.send(result.rows);
      })
      // error handling
      .catch(err => {
        console.log('error making select query:', err);
        res.sendStatus(500);
      });
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
});

router.get('/getStock', (req, res) => {
  // query DB
  if (req.isAuthenticated()) {
    const queryText = `SELECT product_id, current_dt, category,quantity,product_name,product_size,exp_date,storage_location FROM stock`;
    pool
      .query(queryText)
      // runs on successful query
      .then(result => {
        res.send(result.rows);
      })
      // error handling
      .catch(err => {
        console.log('error making select query:', err);
        res.sendStatus(500);
      });
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
});

router.post('/addStock', function(req, res) {
  console.log('in POST router');
  if (req.isAuthenticated()) {
    //add stock to stock table
    const queryText = `INSERT INTO stock
    (current_dt,
      category,
      quantity,
      product_name,
      product_size,
      exp_date,
      storage_location,
      userid) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    pool
      .query(queryText, [
        req.body.current_dt,
        req.body.category,
        req.body.quantity,
        req.body.product_name,
        req.body.product_size,
        req.body.exp_date,
        req.body.storage_location,
        req.user.id
      ])
      .then(result => {
        console.log('result:', result);
        res.send(result);
      })
      // erorr handling
      .catch(err => {
        console.log('error:', err);
        res.sendStatus(500);
      });
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
});

/* ***************************
*******DELETE CATCH ROW*******
******************************
delete table/database row */
router.delete('/deleteStockRow/:product_id', function(req, res) {
  console.log('in router.delete');
  const queryText = 'DELETE FROM stock WHERE product_id = $1';
  pool
    .query(queryText, [req.params.product_id])
    .then(result => {
      console.log('result:', result.rows);
      res.sendStatus(200);
    })
    .catch(err => {
      console.log('error:', err);
      res.sendStatus(500);
    });
}); //end delete row

module.exports = router;
