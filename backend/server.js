const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// MySql kapcsolat
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'konyvesbolt2',
});
connection.connect;


// Végpontok --------------------------------

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'frontend/index.html'));
});

// Vásárlók beolvasása
app.get('/vasarlok/readAll', (req, res) => {
    let sql = "SELECT `vasarloid`,`nev`,`email_cim`,`felhasznalonev` FROM `vasarlo`;";
    connection.query(sql, (err, rows) => {
        if (err){
            console.log("Vásárlók beolvasása sikertelen");
            throw err; 
        }
        else{
            //console.log("Vásárlók beolvasása sikeres");
            res.status(200).json(rows);
        }
    });

});

// Vásárló hozzáadása
app.post('/vasarlok/create', (req,res) => {
    let data = req.body;
    let sql = 'INSERT INTO vasarlo SET ?';
    connection.query(sql, data, (err)=>{
        if (err) throw err;
        console.log('Vásárló hozzáadása sikeres!');
        res.json('Vásárló hozzáadása sikeres!');
        //console.log(data);
    });
});

// Vásárló kiválasztása
app.get('/vasarlok/select/:id', (req, res) => {
    let id = req.params.id;
    let sql = `SELECT vasarloid, nev, email_cim, felhasznalonev FROM vasarlo WHERE vasarloid = ${id};`;
    connection.query(sql, (err,row) => {
        if (err) throw err;
        res.status(200).json(row);
        //console.log(row);
    });
});


// Vásárló törlése
app.delete('/vasarlok/delete/:id', (req, res) => {
    let id = req.params.id;
    let sql = `DELETE FROM vasarlo WHERE vasarloid = ${id};`;
    connection.query(sql, (err) => {
        if (err) throw err;
        console.log('Sikeres törlés!');
        res.json('Sikeres törlés!');
    });
});

// Vásárló módosítása
app.put('/vasarlok/update/:id', (req, res) => { 
    let id = req.params.id;
    let nev = req.body.nev;
    let email_cim = req.body.email_cim;
    let felhasznalonev = req.body.felhasznalonev;
    console.log(req.body);
    let sql = `UPDATE vasarlo SET nev='${nev}', email_cim='${email_cim}', felhasznalonev='${felhasznalonev}' WHERE vasarloid='${id}';`;
    connection.query(sql, (err) => {
        if (err) throw err;
        console.log('Sikeres módosítás!');
        res.json('Sikeres módosítás!');
    });
});


// Szerver futása
app.listen(port, function () {
    console.log(`Portszám: ${port}`);
});
