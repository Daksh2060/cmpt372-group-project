const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const waitOn = require('wait-on');
app.use(cors());

const port = 8080;

const pool = new Pool({
    user: 'postgres',
    host: 'db',
    password: 'root'
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function initializeDatabase() {

    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS temp (id SERIAL PRIMARY KEY)`);
        console.log('Database initialized');
    } 

    catch (error){
        console.error('Error initializing database:', error);
    }
}


waitOn({ resources: ['tcp:db:5432'] }).then(() => {
 
    initializeDatabase().then(() => {
       
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server running on http://0.0.0.0:${port}`);
        });
    });
});