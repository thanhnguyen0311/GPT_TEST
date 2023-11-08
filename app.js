const express = require('express');
const app = express();
const data = require('./data');

const http = require('http');
const port  = process.env.PORT || 3000;

const server = http.createServer(app);
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '272337839',
    database: 'mydb'
})

app.use(express.json())

app.get("/", (req,res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post("/check", (req,res) => {
    let content = req.body.input;
    data.forEach((element, index) => {
        if(content === element.content) {

            connection.connect(function(err){
                if (err) throw err;
                console.log("connected");
                var sql = `INSERT INTO content (content) VALUES ('${content}')`
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                })
                connection.end();
            })
                
            content = content.split(".");
            let edited = element.edit_content.split(".");
            let result = []
            for (let i = 0 ; i < content.length; i++ ){
                if(content[i] != edited[i]){
                    result.push(content[i] + " > " + edited[i])
                } 
            }
            result.push("Edited: " + element.edit_content)
            console.log(result)
            res.send(result)
        }
    })
})

server.listen(port, () => {
    console.log(`server is running on localhost:${port}`)
})
