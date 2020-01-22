var db = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './books.sqlite'
  }
});

module.exports = db