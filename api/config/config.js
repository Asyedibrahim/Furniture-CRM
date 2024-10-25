import mysql from 'mysql2';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'furniture-crm',
    timezone: 'Z'
});

export default db;