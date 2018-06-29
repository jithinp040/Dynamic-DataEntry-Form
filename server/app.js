/**
 * The node is constructed as a server side applet with the help of expressjs
 * 
 * The requests are normaly done by using http server but we use expressjs
 * This acts like a bootstrap for html and provides us with many features
 * 
 * The node provides basic features for CRUD applications like
 * 1.Autocomplete Form
 * 2.Fetch the details of the given name from DB
 * 3.Add a new person to the DB with details
 * 4.Update the details of an existing person in the DB
 * 5.Deletion of a person from the DB
 * 
 * Some of the features i really need to update are the use of 
 * 1.Form Validation
 * 2.Usage of Multipart form updation with the help of Multer
 * 3.Generating PDF with the help of Nodejs
 */



var express = require('express')
var app = express()
var mysql = require('mysql')

/**
 * This middleware provides a consistent API 
 * for MySQL connections during request/response life cycle
 */ 
var myConnection  = require('express-myconnection')
/**
 * Store database credentials in a separate config.js file
 * Load the file/module and its values
 */ 
var config = require('./config')
var dbOptions = {
	host:	  config.database.host,
	user: 	  config.database.user,
	password: config.database.password,
	port: 	  config.database.port, 
	database: config.database.db,
	/*charset:	config.database.charset*/
}
/**
 * 3 strategies can be used
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 */ 
app.use(myConnection(mysql, dbOptions, 'pool'))

var bodyParser = require('body-parser')
/**
 * bodyParser.urlencoded() parses the text as URL encoded data 
 * (which is how browsers tend to send form data from regular forms set to POST) 
 * and exposes the resulting object (containing the keys and values) on req.body.
 */ 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
var expressValidator = require('express-validator')
app.use(expressValidator())

/**
 * The Code below wouldnt prove useful 
 * if you are using web application running on Chrome
 * with CORS enabled.But this shines when you run it as an application on a framework
 * such as electron  
 */
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

// USED FOR FILLING AUTOCOMPLETE FORM
app.get('/autoc', function(req, res, next) {
	let name=req.query.name
	console.log(name)
	req.getConnection(function(error, conn) {
		conn.query("SELECT * FROM master_table WHERE name LIKE '"+name+"%'",function(err, rows, fields) {
			//if(err) throw er
			if (err) {
				console.log(err)
				res.json([{
					data: ''
				}])
			} else {
				console.log(rows)
				res.json({
					data: rows
				})
			}
		})
	})
})

//USED TO GET THE DATA OF THE PERSON GIVEN IN NAME FIELD
app.get('/list/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		var user=[
			req.query.tb,
			req.query.id
		]
		console.log(user)
		conn.query("call get_val(?,?)",user,function(err, rows, fields) {//Stored procedure call
			//if(err) throw er
			if (err) {
				console.log(err)
				res.json([{
					data: ''
				}])
			} else {
				console.log(rows)
				res.json({
					data: rows[0]//Holds the result
				})
			}
		})
	})
})

//INSERTION PART 2
/*Important here ,the function is used because node follows asyncronous calling
which means that the program doesnt wait for results of processing , in this case
query results . So it is necessary that we call a function inside the results of query processing*/
function st(req,user){
	req.getConnection(function(error, conn) {
		conn.query("call insert_marks(?,?,?,?,?,?,?)", user, function(err, result) {
			if (err) {
				console.log(err)
				console.log("Not updated")
			} else {
				console.log('success Data updated successfully!')
				console.log(result)
				console.log(user)
			}
		})
	})

}
//PART 1 INSERTION
app.put('/update/', function(req, res, next) { 
	var i=1;
	for(i=0;i<req.body.db.length;i++){
	var det=[req.body.db[i].name,req.body.db[i].image]
	var user =[	req.body.tb,
		req.body.db[i].rl,
		req.body.db[i].maths,
		req.body.db[i].science,
		req.body.db[i].social,
		req.body.db[i].total,
		req.body.db[i].image
	]
	if(user[1]==0){
		console.log("this gets executed")
		req.getConnection(function(error,conn){
			console.log(det)
			conn.query("call insert_name(?,?)",det,function(err,rows){
				if(err){
					console.log(err)
					res.json("Data Not Processed")
				}
				else{
					user[1]=JSON.stringify(rows[0][0].id)
					console.log(JSON.stringify(rows[0][0].id))
					console.log(user[1])
					st(req,user)	
				}
			})
		})
	}else{st(req,user)}	
}
})

app.put('/list1/', function(req, res, next) { 
	var user =[	req.body]
	console.log(user)
	res.json([{user}])
})

app.delete('/delete/', function(req, res, next) {
	var user=[req.query.tb,req.query.rl]
	req.getConnection(function(error, conn) {
		conn.query("call del_val(?,?)",user, function(err, result) {
			//if(err) throw err
			if (err) {
				console.log(err)
			} else {
				console.log('success User deleted successfully! id = ' + user[1])
				// redirect to users list 
			}
		})
	})
})


app.listen(3000, function(){
	console.log('Server running at port 3000: http://127.0.0.1:3000')
})