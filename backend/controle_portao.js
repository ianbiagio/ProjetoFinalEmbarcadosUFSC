const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let porta = 8090;
app.listen(porta, () => {
    console.log('Servidor usuarios em execução na porta: ', porta);
});

const sqlite3 = require('sqlite3');
db = new sqlite3.Database('./controle_portao.db', (err) => {
    if (err) {
        console.log('Um erro aconteceu ao conectar ao banco de dados');
        throw err;
    }
    console.log('Conectado ao SQLite!');
});

db.run(`CREATE TABLE IF NOT EXISTS controle_portao (
    frequencia INT,
    id INT,
    led TEXT
)`, [], (err) => {
    if (err) {
        console.log('ERRO: não foi possível criar tabela.');
        throw err;
    }
});

app.post('/ControlePortao', (req, res, next) => {
    const { frequencia,id,led } = req.body;

    db.run(`INSERT INTO controle_portao (frequencia,id,led) VALUES (?,?,?)`,
        [frequencia,id,led], function (err) {
        if (err) {
            console.log("Error: ", err);
            res.status(500).send('Erro ao receber controle portao');
        } else {
            console.log('Recebimento de controle portao ok');
            const id = this.lastID;
            res.status(200).send({ message: 'Recebimento de controle portao', id: id });
        }
    });
});
