var PouchDB = require('pouchdb');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

PouchDB.plugin(require('pouchdb-find'));

var db = new PouchDB('http://couchadmin:admin@localhost:5984/products');
db.info()
.then(info => console.log(info))
.catch(e => console.log(e));

var localDB = new PouchDB('products');	
localDB.info(info => {
	console.log("Local Database");
	console.log(info);
}).catch(e => console.log(e));

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

app.get('/home',(req,res) => {
	res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/getProducts',(req,res) => {
	localDB.allDocs({ include_docs: true, descending: true })
	.then(docs => {
		let products = null;
		if(docs && docs.rows){
			products = docs.rows.map(item => {
				return item.doc;
			});
		}
		res.send({
			success : true,
			data : products 
		});
	})
	.catch(e => res.send({
		success : false,
		...e
	}));
});

app.get('/syncData',(req, res)=>{
	localDB.sync(db).on('complete',() => 
		res.send({ success : true })
	).on('error', error => res.send({
		success : false,
		...error
	}));
});

app.post('/createProduct',(req,res) => {
	data = {
			...req.body, 
			_id : req.body.name
		};
	let response = {
		data : data,
		success : true
	};
	localDB.put(data)
	.then(info => res.send(response))
	.catch(e => res.send({error : "Couldnt save it"}));
});

app.listen(3000, () => console.log("Listeing on 3000"));

