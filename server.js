const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('./database/MontresDB.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database');
  }
});

app.post('/inscription', (req, res) => {
  const { NomUser, MotDePasse } = req.body;

  const query = 'INSERT INTO Utilisateurs (NomUser, MotDePasse) VALUES (?, ?)';
  db.run(query, [NomUser, MotDePasse], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ UserID: this.lastID });
  });
});

app.post('/connexion', (req, res) => {
  const { NomUser, MotDePasse } = req.body;

  const query = 'SELECT * FROM Utilisateurs WHERE NomUser = ?';
  db.get(query, [NomUser], (err, Utilisateur) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const token = jwt.sign({ UserID: Utilisateur.UserID }, 'votre_clé_secrète', { expiresIn: '1h' });

    res.json({ token, UserID: Utilisateur.UserID });
  });
});

function verifierToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Accès non autorisé' });
  }

  jwt.verify(token, 'votre_clé_secrète', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token non valide' });
    }

    req.UserID = decoded.UserID;
    next();
  });
}

app.get('/', (req, res) => {
    res.redirect('/montres');
});

app.get('/montres', (req, res) => {
    db.all('SELECT * FROM Montre', (err, rows) => {
        if (err) {
            console.error('Error fetching recipes:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(rows);
    });
});

app.get('/users', (req, res) => {
    db.all('SELECT * FROM User', (err, rows) => {
        if (err) {
            console.error('Error fetching recipes:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(rows);
    });
});

app.get('/panier/:userID', (req, res) => {
    const { userID } = req.params;

    const getCountQuery = 'SELECT COUNT(DISTINCT montreID) as montreCount FROM Panier WHERE userID = ?';

    const getMontreIDQuery = 'SELECT DISTINCT montreID FROM Panier WHERE userID = ?';

    Promise.all([
        new Promise((resolve, reject) => {
            db.get(getCountQuery, [userID], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ montreCount: row.montreCount });
                }
            });
        }),
        new Promise((resolve, reject) => {
            db.all(getMontreIDQuery, [userID], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ montreIDList: rows.map(row => row.montreID) });
                }
            });
        }),
    ])
        .then(results => {
            const [countResult, montreIDResult] = results;
            res.json({ ...countResult, ...montreIDResult });
        })
        .catch(err => {
            console.error('Error fetching cart data:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        });
});




app.post('/panier/:userID/add/montre', (req, res) => {
    const { userID } = req.params;
    const { montreID } = req.body;

    db.get('SELECT * FROM Panier WHERE panierID = ?', [userID], (err, cart) => {
      if (err) {
        console.error('Error checking cart existence:', err.message);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (!cart) {
        res.status(404).json({ error: 'Cart not found' });
        return;
      }

      db.get('SELECT * FROM Montre WHERE montreID = ?', [montreID], (err) => {
        if (err) {
          console.error('Error checking watch existence:', err.message);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        else{
          insertWatchIntoCart();
        }
      });
    });

    function insertWatchIntoCart() {
      db.run('INSERT INTO Panier (panierID, montreID) VALUES (?, ?)', [userID, montreID], function (err) {
        if (err) {
          console.error('Error adding watch to the cart:', err.message);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        db.all('SELECT * from Panier WHERE panierID = ?', [userID], (err, cart) => {
          if (err) {
            console.error('Error fetching cart: ', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
          }
        });
      });
    }
});

app.post('/panier/:userID/remove/montre', (req, res) => {
    const { userID } = req.params;
    const { montreID } = req.body;

    db.get('SELECT * FROM Panier WHERE panierID = ?', [userID], (err, cart) => {
        if (err) {
            console.error('Error checking cart existence:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
            return;
        }

        db.get('SELECT * FROM Panier WHERE panierID = ? AND montreID = ?', [userID, montreID], (err, watchInCart) => {
            if (err) {
                console.error('Error checking watch existence in the cart:', err.message);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            if (!watchInCart) {
                res.status(404).json({ error: 'Watch not found in the cart' });
                return;
            }

            removeWatchFromCart();
        });
    });

    function removeWatchFromCart() {
        db.run('DELETE FROM Panier WHERE panierID = ? AND montreID = ?', [userID, montreID], function (err) {
            if (err) {
                console.error('Error removing watch from the cart:', err.message);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            db.all('SELECT * FROM Panier WHERE panierID = ?', [userID], (err, updatedCart) => {
                if (err) {
                    console.error('Error fetching updated cart:', err.message);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }
                res.json(updatedCart);
            });
        });
    }
});


app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const sqlInsertUser = `INSERT INTO User (email, password) VALUES (?, ?)`;

  db.run(sqlInsertUser, [email, password], function (err) {
    if (err) {
      console.error('Error creating account:', err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    const userId = this.lastID;

    const panierID = userId;

    const sqlUpdatePanierID = `UPDATE User SET panierID = ? WHERE email = ?`;
    db.run(sqlUpdatePanierID, [panierID, email], function (err) {
      if (err) {
        console.error('Error updating panierID:', err.message);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      console.log(`Account created with email: ${email}, panierID: ${panierID}`);
      res.json({ message: 'Account created successfully' });
    });
  });
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM User WHERE email = ? AND password = ?`;
    db.get(sql, [email, password], (err, row) => {
        if (err) {
            console.error('Error during login:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (row) {
            console.log('Login successful');
            res.json({ message: 'Login successful' });
            identifiant = email
            test = password

        } else {
            console.log('Invalid email or password');
            res.status(401).json({ error: 'Invalid email or password' });
        }
    });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});