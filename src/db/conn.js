const { Client } = require('pg');

const client = new Client({
    user: 'Kalash',
    host: 'localhost',
    database: 'postgres',
    password: 'Kalash@2911',
    port: 5432,
});

client.connect((err) => {
    if (err)
        console.error(err);
    else
        console.log('Connected');
})


module.exports = client;

