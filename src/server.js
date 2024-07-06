require('dotenv').config();
const express = require('express');
const chat = require('./chatbot');
const sync = require('./database/sync');
const cors = require('cors');
const sequelize = require('./database/config');

// Sync the database
try{
    sync();
    console.log('Connection has been established successfully.');
}
catch(error){
    throw new Error(error);
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.post('/chat', (req, res) => chat(req, res));


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})