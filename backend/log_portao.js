const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let porta = 8080;
app.listen(porta, () => {
    console.log('Servidor usuarios em execução na porta: ', porta);
});

const sqlite3 = require('sqlite3');
db = new sqlite3.Database('./log_portao.db', (err) => {
    if (err) {
        console.log('Um erro aconteceu ao conectar ao banco de dados');
        throw err;
    }
    console.log('Conectado ao SQLite!');
});

db.run(`CREATE TABLE IF NOT EXISTS log_portao (
    dt_inc TEXT DEFAULT (datetime('now', 'localtime')),
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    abertura BOOLEAN,
    tipo_portao TEXT
)`, [], (err) => {
    if (err) {
        console.log('ERRO: não foi possível criar tabela.');
        throw err;
    }
});

app.post('/LogPortao', (req, res, next) => {
    const { tipo_portao } = req.body;

    db.run(`INSERT INTO log_portao (tipo_portao) VALUES (?)`,
        [tipo_portao], function (err) {
        if (err) {
            console.log("Error: ", err);
            res.status(500).send('Erro ao receber log portao');
        } else {
            console.log('Recebimento de log portao ok');
            const id = this.lastID;
            res.status(200).send({ message: 'Recebimento de log portao', id: id });
        }
    });
});

app.post('/LogPortao-Mobile', (req, res, next) => {
    const { abertura } = req.body;

    db.get(`SELECT MAX(ID) AS maxId FROM LOG_PORTAO`, [], (err, row) => {
        if (err) {
            console.log("Error: ", err);
            res.status(500).send('Erro ao receber log portao mobile');
        } else {
            const id = row.maxId;

            db.run(`UPDATE log_portao SET abertura = ? WHERE id = ?`,
                [abertura, id], function (err) {
                if (err) {
                    console.log("Error: ", err);
                    res.status(500).send('Erro ao receber log portao mobile');
                } else {
                    console.log('Recebimento de log portao mobile ok');
                    res.status(200).send({ message: 'Atualização de log portao mobile', id: id });
                }
            });
        }
    });
});

app.get('/GetLogPortao', (req, res, next)=>{
    db.get(`SELECT * FROM log_portao`,(err, result)=>{
        if (err){
            console.log('Erro: ', err)
            res.status(500).send('Erro ao obter dados')
        } else if (result == null){
            console.log('Log não encontrada')
            res.status(404).send('Log não encontrada')
        } else {
            res.status(200).json(result)
        }
    })
})