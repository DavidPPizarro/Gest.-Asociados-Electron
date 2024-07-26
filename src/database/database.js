const mysql = require('promise-mysql')
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

function getConnection(){
    return connection;
}

//exporto la función para que otros la utilicen
module.exports = {getConnection}