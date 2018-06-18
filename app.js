var express = require('express');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var cookparser = require('cookie-parser');
var expsession = require('express-session');
var nodemailer = require('nodemailer');

var router = express.Router();

var app = express();

app.use(expsession({secret: "iamawesome",saveUninitalized:true, resave: true}));

app.set('view engine','ejs');

var transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'gautampram@hotmail.com',
    pass: 'Pattaram!1'
  }
});

var url = 'mongodb://gautampb:grp@ds059207.mlab.com:59207/pboc';
app.use(express.static('./public'));

var urlencodedParser = bodyParser.urlencoded({extended: false});

app.get('/',function(req, res){

	if(req.session.uname===null || req.session.uname===undefined || req.session.uname===''){
			res.render('signup');
	}else {
		res.redirect('/profile/'+req.session.uname);
	}

});

app.get('/verify',function(req, res){

		res.render('verify');

});

app.get('/login',function(req, res){

		res.render('signup');

});

app.get('/uname', function(req, res){
	var itemarr = [];

	if(req.params.uname===req.session.uname){
		mongo.MongoClient.connect(url, function(err, db) {

		  if (err) throw err;
		  var dbo = db.db('pboc');
		  var cursor = dbo.collection("PBkUser").find({"username":req.query.uname}).toArray(function(err, result) {
						  	    
								    var bf = result.length;

								    if (err) throw err;
								    db.close();
								    if (bf > 0){
									    res.send('Matched');
									}else{
									    res.send('Not Matched');	
									}
	  			});
		});
	} else{
		res.redirect("/");
	}
});

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

app.get('/profile/:uname',function(req, res){

	var fullName = [];
	var cidarr = [];
	var temp1 = [];
	var temp2 = [];
	req.session.route = '/profile/'+req.session.uname;
	if(req.params.uname===req.session.uname){
		mongo.MongoClient.connect(url, function(err, db) {

		  if (err) throw err;
		  var dbo = db.db('pboc');
		  var cursor = dbo.collection("PBkUser").find({"username":req.params.uname}).toArray(function(err, result) {
								    if (err) throw err;
								    db.close();
 						    		    res.render('profile',{name: result});
	  			});

		});
	} else{
		res.redirect('/profile/'+req.session.uname);
	} 
	if(req.session.uname===null || req.session.uname === undefined || req.session.uname === ""){
		res.redirect('/');
	}
});

app.get('/contact/:uname',function(req, res){
	var fullName = [];
	var cidarr = [];
	var temp1 = [];
	var temp2 = [];

	if(req.params.uname===req.session.uname){
		mongo.MongoClient.connect(url, function(err, db) {

		  if (err) throw err;
		  var dbo = db.db('pboc');
		  var cursor = dbo.collection("Contacts").find({"pbowner":req.params.uname}).toArray(function(err, result) {
								    if (err) throw err;
								    db.close();
 						    		    res.send(result);
				});
		});
	} else{
		res.redirect("/");
	}
});

app.get('/permissions/:uname/:cdtl',function(req, res){

	if(req.params.uname===req.session.uname){
		mongo.MongoClient.connect(url, function(err, db) {

		  if (err) throw err;
		  var dbo = db.db('pboc');

		  var cursor = dbo.collection("Permissions").find({"pbowner":req.params.uname,"cdtl":req.params.cdtl});
		  cursor.toArray(function(err , result) {
						    if (err) throw err;
				    		    res.send(result);
	  			});
				db.close();
		});
	} else{
		res.redirect("/");
	}
});

app.get('/mobile/:uname',function(req, res){
	var fullName;
//	if(req.params.uname===req.session.uname){
	 	 mongo.MongoClient.connect(url, function(err, db) {

		  if (err) throw err;
		  var dbo = db.db('pboc');
		  var cursor = dbo.collection("mobile").find({pbowner:req.params.uname}).sort({label:1}).toArray(function(err, result) {
								    if (err) throw err;
								    db.close();
 						    		    res.send(result);
	  			});
		});
//	} else{
//		res.redirect("/");
//	}
});

app.get('/infoshare/:contact/:uname',function(req, res){
	var fullName;
		mongo.MongoClient.connect(url, function(err, db) {

		  if (err) throw err;
		  var dbo = db.db('pboc');
		  var cursor = dbo.collection("Permissions").find({"pbowner":req.params.contact,"contact":req.params.uname}).toArray(function(err, result) {
								    if (err) throw err;
								    db.close();
 						    		    res.send(result);
	  			});
		});

});

app.get('/cdtl/:cdtl',function(req, res){

		mongo.MongoClient.connect(url, function(err, db) {

		  if (err) throw err;
		  var dbo = db.db('pboc');
		  var cursor = dbo.collection("mobile").find({"_id":req.params.cdtl}).toArray(function(err, result) {
								    if (err) throw err;
								    db.close();
 						    		    res.send(result);
	  			});
		});

});

app.get('/yourdetails/:uname',function(req, res){
	var fullName;
	if(req.params.uname===req.session.uname){
		mongo.MongoClient.connect(url, function(err, db) {

		  if (err) throw err;
		  var dbo = db.db('pboc');
		  var cursor = dbo.collection("mobile").find({"pbowner":req.params.uname}).toArray(function(err, result) {
								    if (err) throw err;
								    db.close();
 						    		    res.send(result);
	  			});

	  
		});
	} else{
		res.redirect("/");
	}
});

app.get('/contactsearch/:uname',function(req, res){
	req.session.route = '/contactsearch/'+req.session.uname;
	if(req.params.uname===req.session.uname){
		mongo.MongoClient.connect(url, function(err, db) {

		  if (err) throw err;
		  var dbo = db.db('pboc');
		  var cursor = dbo.collection("PBkUser").find({"username":req.params.uname}).toArray(function(err, result) {
								    if (err) throw err;
								    db.close();
	 					    		    res.render('contacts',{user:result});
  				});

		});
	} else{
		res.redirect('/profile/'+req.session.uname);
	}
	if(req.session.uname===null || req.session.uname === undefined || req.session.uname === ""){
		res.redirect('/');
	}
});

app.get('/contactmatch/:uname/:searchword',function(req, res){
	var emptyarr =[];
//	if(req.params.uname===req.session.uname){
		mongo.MongoClient.connect(url, function(err, db) {

		  if (err) throw err;
		  var dbo = db.db('pboc');
		  var cursor = dbo.collection("Contacts").find({"pbowner":req.params.uname,"cFName":req.params.searchword}).toArray(function(err, result) {
								    if (err) throw err;
								    db.close();
							if(result.length>0){
								res.send(result);
								} else{
								res.send(emptyarr);
								}
  				});

		});
//	} else{
//		res.redirect("/");
//	}
});

app.get('/peoplematch/:searchword',function(req, res){
	var emptyarr =[];
//	if(req.params.uname===req.session.uname){
		mongo.MongoClient.connect(url, function(err, db) {

		  if (err) throw err;
		  var dbo = db.db('pboc');
		  var cursor = dbo.collection("PBkUser").find({"First_Name":req.params.searchword}).toArray(function(err, result) {

							if (err) throw err;
							db.close();
							if(result.length>0){
								res.send(result);
								} else{
								res.send(emptyarr);
								}
  				});

		});
//	} else{
//		res.redirect("/");
//	}
});

app.get('/maxuid',function(req, res){

	mongo.MongoClient.connect(url, function(err, db) {

	  if (err) throw err;
	  var dbo = db.db('pboc');

	  var cursor = dbo.collection("PBkUser").find({}).sort({"_id":-1}).toArray(function(err, result) {

							    var bf = result.length;

							    if (err) throw err;
							    db.close();

							    if (bf > 0){
								    if (err) throw err;
									res.send(result[0]);
							    } else{
								    console.log('User does not exist');	
							    }
  			});
	});
});

app.get('/logout', urlencodedParser, function(req, res){

	req.session.destroy();

	res.redirect('/');

});

app.post('/', urlencodedParser, function(req, res){

	if(req.body.pwd === req.body.rpwd){

		req.session._id = req.body.id,
		req.session.fname = req.body.fname;
		req.session.lname = req.body.lname;
		req.session.mname = req.body.mname;
		req.session.name = req.body.fname+" "+req.body.lname;	
		req.session.uname = req.body.uname;
		req.session.password = req.body.pd;
		req.session.email = req.body.email;

		var x = Math.floor((Math.random() * 3) + 4);
		var vCode ="";
		var i;
		var cSet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

		for (j = 0; j < x; j++) { 
			i = Math.floor(Math.random() * 62);
			if (i < 26){
				vCode += cSet[i];
			} else if(i> 25 && i < 52){
				vCode += cSet[i - 26].toUpperCase();
			} else if(i > 51){
				vCode += i - 52;
			}
	}

	req.session.vcode = req.body.vcode;

	var mailOptions = {
	  from: 'gautampram@hotmail.com',
	  to: req.session.email,
	  subject: 'Account Creation Verification',
	  text: 'Hi ' + req.session.name +'! \n Please verify yourself by entering the below verification code \n                    ' + vCode + '\n. \n \n Thank you ' + '\n Admin' 
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	    res.redirect('/verify');
	  }
	});
	} else{
	    return res.status(404).send();
	}


});

app.post('/verify', urlencodedParser, function(req, res){
	if(req.session.vcode === req.body.vcode){

		var item = {};
		mongo.MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db('pboc');
			bcrypt.genSalt(10, function(err, salt){

				bcrypt.hash(req.session.password, salt, function(err, hash){

				item = {
					_id: req.session._id,
					username:req.session.uname,
					name:req.session.name,
					First_Name:req.session.fname,
					Last_Name:req.session.lname,
					Middle_Name:req.session.mname,
					password:hash
					};

			    dbo.collection("PBkUser").insertOne(item, function(err, res) {
			    if (err) throw err;

			    db.close();
			  });

				});
			});

		});
		res.redirect('/login');
	} else{
		res.send('Verification code is not matching');
	}
});

app.post('/login', urlencodedParser, function(req, res){

	var itemarr = [];

	mongo.MongoClient.connect(url, function(err, db) {

	  if (err) throw err;
	  var dbo = db.db('pboc');

	  var cursor = dbo.collection("PBkUser").find({"username":req.body.unm}).toArray(function(err, result) {

							    var bf = result.length;

							    if (err) throw err;
							    db.close();

							    if (bf > 0){

								bcrypt.compare(req.body.pwd, result[0].password, function(err, rs) {

									    if (err) throw err;

									    if(rs){
											req.session.uname = req.body.unm;
											req.session.password = req.body.pwd;
											res.redirect("/profile/"+req.body.unm);
										} else{
											res.send('Incorrect password');
										}
									});

							    } else{
								    res.send('User does not exist');	
							    }

  			});
	  
	});

});

app.post('/mobile', urlencodedParser, function(req, res){

	var lObj = req.body;
	var len = Object.keys(lObj).length;

	mongo.MongoClient.connect(url, function(err, db) {
      
	if (err) throw err;
	var dbo = db.db('pboc');


	var j = 0;


		      dbo.collection("mobile").deleteMany({ pbowner: req.session.uname, type: "MOB"},function(err,result){

			});

		for(i=0;i<len/3;i++){


		      obj = {
			_id: lObj[Object.keys(lObj)[j]],
			pbowner: req.session.uname,
			label : lObj[Object.keys(lObj)[j+1]],
			contactno: lObj[Object.keys(lObj)[j+2]],
			type: "MOB"
			};	



			dbo.collection("mobile").save(obj, function(err, res) {
				    if (err) throw err;
		  });
		j = j + 3;		

	}
        db.close();      
	res.redirect('/profile/'+req.session.uname);
    });

});


app.post('/landline/', urlencodedParser, function(req, res){

	var lObj = req.body;
	var len = Object.keys(lObj).length;

	mongo.MongoClient.connect(url, function(err, db) {
      
	if (err) throw err;
	var dbo = db.db('pboc');
	var j = 0;

		      dbo.collection("mobile").deleteMany({ pbowner: req.session.uname, type: "LAN"},function(err,result){
					console.log("deleted");
			});

	for(i=0;i<len/3;i++){

	      obj = {
		_id: lObj[Object.keys(lObj)[j]],
		pbowner: req.session.uname,
		label : lObj[Object.keys(lObj)[j+1]],
		contactno: lObj[Object.keys(lObj)[j+2]],
		type: "LAN"
		};	



		dbo.collection("mobile").save(obj, function(err, res) {
			    if (err) throw err;
	  });
		j = j + 3;		
	}
        db.close();      
	res.redirect('/profile/'+req.session.uname);
    });

});

app.post('/address', urlencodedParser, function(req, res){

	var lObj = req.body;
	var len = Object.keys(lObj).length;

	mongo.MongoClient.connect(url, function(err, db) {
      
	if (err) throw err;
	var dbo = db.db('pboc');
	var j = 0;

		      dbo.collection("mobile").deleteMany({ pbowner: req.session.uname, type: "ADD"},function(err,result){
					console.log("deleted");
			});

	for(i=0;i<len/3;i++){

	      obj = {
		_id: lObj[Object.keys(lObj)[j]],
		pbowner: req.session.uname,
		label : lObj[Object.keys(lObj)[j+1]],
		contactno: lObj[Object.keys(lObj)[j+2]],
		type: "ADD"
		};	



		dbo.collection("mobile").save(obj, function(err, res) {
			    if (err) throw err;
	  });
		j = j + 3;		
	}
        db.close();      
	res.redirect('/profile/'+req.session.uname);
    });

});

app.post('/email', urlencodedParser, function(req, res){

	var lObj = req.body;
	var len = Object.keys(lObj).length;

	mongo.MongoClient.connect(url, function(err, db) {
      
	if (err) throw err;
	var dbo = db.db('pboc');


	var j = 0;


		      dbo.collection("mobile").deleteMany({ pbowner: req.session.uname, type: "EML"},function(err,result){
					console.log("deleted");
			});

		for(i=0;i<len/3;i++){


		      obj = {
			_id: lObj[Object.keys(lObj)[j]],
			pbowner: req.session.uname,
			label : lObj[Object.keys(lObj)[j+1]],
			contactno: lObj[Object.keys(lObj)[j+2]],
			type: "EML"
			};	



			dbo.collection("mobile").save(obj, function(err, res) {
				    if (err) throw err;
		  });
		j = j + 3;		

	}
        db.close();      
	res.redirect('/profile/'+req.session.uname);
    });

});


app.post('/visibility/:cdtl', urlencodedParser, function(req, res){

	var lObj = req.body;
	var len = Object.keys(lObj).length;

	mongo.MongoClient.connect(url, function(err, db) {
      
	if (err) throw err;
	var dbo = db.db('pboc');
	var j = 0;

		      dbo.collection("Permissions").deleteMany({ pbowner: req.session.uname, cdtl: req.params.cdtl},function(err,result){
					console.log("deleted");
			});

	for(i=0;i<len;i++){

	      obj = {
		pbowner: req.session.uname,
		contact : lObj[Object.keys(lObj)[i]],
		cdtl: req.params.cdtl
		};	



		dbo.collection("Permissions").save(obj, function(err, res) {
			    if (err) throw err;
	  });
	}
        db.close();      
	res.redirect('/profile/'+req.session.uname);
    });

});

app.post('/permissions/:contact', urlencodedParser, function(req, res){

	var lObj = req.body;
	var len = Object.keys(lObj).length;

	mongo.MongoClient.connect(url, function(err, db) {
      
	if (err) throw err;
	var dbo = db.db('pboc');
	var j = 0;

		      dbo.collection("Permissions").deleteMany({ pbowner: req.session.uname, contact: req.params.contact},function(err,result){
					console.log("deleted");
			});

	for(i=0;i<len;i++){

	      obj = {
		pbowner: req.session.uname,
		cdtl : lObj[Object.keys(lObj)[i]],
		contact: req.params.contact
		};	



		dbo.collection("Permissions").save(obj, function(err, res) {
			    if (err) throw err;
	  });
	}
        db.close();      
	res.redirect('/contactsearch/'+req.session.uname);
    });

});

app.post('/addcontact', urlencodedParser, function(req, res){

	var lObj = req.body;
	var len = Object.keys(lObj).length;

	mongo.MongoClient.connect(url, function(err, db) {
      
	if (err) throw err;
	var dbo = db.db('pboc');

	      obj = {
		pbowner: req.session.uname,
		contact : lObj.uid,
		cFName: lObj.ufname,
		cLName: lObj.ulname
		};	



		dbo.collection("Contacts").save(obj, function(err, res) {
			    if (err) throw err;
			        db.close();      

	  });
	res.redirect('/contactsearch/'+req.session.uname);
    });

});

app.listen(3001);

console.log('You are listening to port 3001');