const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('Montres.db');

const createTablesSQL = fs.readFileSync('createTable.sql', 'utf-8');
db.exec(createTablesSQL, (err) => {
  if (err) {
    console.error('Erreur lors de la création de la table :', err.message);
  } else {
    console.log('Table créée avec succès.');

    const insertDataSQL = fs.readFileSync('insertData.sql', 'utf-8');
    db.exec(insertDataSQL, (err) => {
      if (err) {
        console.error(`Erreur lors de l'insertion de données :`, err.message);
      } else {
        console.log('Données insérées avec succès.');
      }
      db.close();
    });
  }
});