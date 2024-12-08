const { requestQuery } = require('./connectDb');

// requestQuery('SelecT TOP 3 * FROM Person');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000 | process.env.PORT;
const bodyParser = require('body-parser');

const version = `1.1.1`;

app.use(bodyParser.json());

app.get('', function(req, res){
    res.send('<form method="POST" action="/register"><button>Register</button></form>')
})

app.get(`/${version}/:tableName.json`, (req, res) => {
    const tableName = req.params.tableName;
    requestQuery(`SELECT * FROM ${tableName}`);
    const filePath = path.join(__dirname, `database\\${tableName}.json`); // Path to the JSON file

    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error reading the JSON file.');
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(data); // Send the file content as the response
        }
    });
});

app.listen(PORT, ()=> {
    console.log('App listening on port', PORT, 'hello');
});