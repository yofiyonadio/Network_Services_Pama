const sql = require("mssql");

let server = true;
let dbo

let config = {
  db1: {},
  db2: {}
};

if (server) {
  
  config.db1 = {
    user: 'network_user',
    password: 'persada',
    server: 'jiepsqco413',
    database: 'DB_LOG_NETWORK',
    options: {
      enableArithAbort: false,
      encrypt: false
    }
  };
  /*
  config.db1 = {
    user: 'pentaho',
    password: 'persada123',
    server: 'jiepsqdv401',
    database: 'DB_YY_SERVICES',
    options: {
      enableArithAbort: false,
      encrypt: false
    }
  };
  */
  config.db2 = {
    user: 'pentaho',
    password: 'persada123',
    server: 'jiepsqdv401',
    database: 'DB_CDP',
    options: {
      enableArithAbort: false,
      encrypt: false
    }
  };
} else {
  config.db1 = {
    user: 'sa',
    password: '713320',
    server: 'localhost',
    database: 'local',
    options: {
      enableArithAbort: false,
      encrypt: false
    }
  };
  config.db2 = {
    user: 'sa',
    password: '713320',
    server: 'localhost',
    database: 'local',
    options: {
      enableArithAbort: false,
      encrypt: false
    }
  };
}

if (server) {
  dbo = 'dbo'
} else {
  dbo = 'guest'
}

const mssql = new sql.ConnectionPool(config.db1, function (err) {
  if (err) throw err;
});

const mssql2 = new sql.ConnectionPool(config.db2, function (err) {
  if (err) throw err;
});




module.exports = { mssql, mssql2, dbo };