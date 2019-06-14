var PouchDB = require('pouchdb');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

PouchDB.plugin(require('pouchdb-find'));

var db = new PouchDB('http://couchadmin:admin@localhost:5984/products');
	db.info()
	.then(info => console.log(info))
	.catch(e => console.log(e));

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

app.get('/createDB',(req,res) => {
	res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/getProducts',(req,res) => {
	db.get()
	.then(docs => cosole.log(docs))
	.catch(e => console.log(e));
});

app.post('/createProduct',(req,res) => {
	data = {
			...req.body, 
			_id : req.body.name
		};
	var response = {
		data : data,
		success : true
	};
	db.put(data)
	.then(info => res.send(response))
	.catch(e => res.send({error : "Couldnt save it"}));
});

app.listen(3000, () => console.log("Listeing on 3000"));

