const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

module.exports = (app) => {
  app.use(session({
    store: new SQLiteStore,
    secret: process.env.SESSION_SECRET || 'zo-opgelost-session-secret',
    resave: false,
    saveUninitialized: false
  }));
};
