var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var session = require("express-session");

app.use(session({secret: 'thisissecret'}));
app.use(express.static(path.join(__dirname, './static')));
const flash = require('express-flash');
app.use(flash());

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/mongoose_dashboard');
mongoose.Promise = global.Promise;

var ElephantSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2},
    description: { type: String, required: true, minlength: 8},
    created_at: Date,
   },{
       timestamps: true
    });

mongoose.model('elephants', ElephantSchema);
var Elephant = mongoose.model('elephants')

app.get('/', function(request, response) {
    Elephant.find({}, function(err, elephanties) {
        if(err) {
            console.log("There was an error.");
            result.render("index");
        } else {
            console.log("Success!");
            response.render("index", {elephantData: elephanties});
        }
      })
})

app.get('/elephants', function(request,response) {
    response.render("create");
})

app.post('/elephants', function(request, response) {
    console.log("POST DATA", request.body);
    Elephant.create(request.body, function(err, elephantyy) {
        if(err) {
            response.render('index', {errors: elephantyy.errors});
        } else {
            console.log('Successfully added an elephant!');
            response.redirect("/");
        }
    })
})

app.get('/elephants/:id', function(request, response) {
    console.log("elephant id-----"+"ObjectId('"+request.params.id+"')")
    Elephant.findOne({_id:request.params.id}, function(err, elephanties) {
        if(err) {
            console.log("Error- could not find data.");
            response.render("index");
        } else {
            response.render("show", {elephantData: elephanties});
        }
    })
})

app.get('/elephants/edit/:id', function(request, response) {
    console.log("elephant id-----"+"ObjectId('"+request.params.id+"')")
    Elephant.findOne({_id:request.params.id}, function(err, elephanties) {
        if(err) {
            console.log("Error- could not find data.");
            response.render("index");
        } else {
            response.render("edit", {elephantData: elephanties});
        }
    })
})

app.post('/elephants/edit/:id', function(request, response) {
    Elephant.updateOne({_id:request.params.id}, request.body, function(err, elephantyy) {
        if(err) {
            console.log('something went wrong saving user');
            console.log(elephantyy.errors);
            response.render('edit', {errors: elephantyy.errors});
        } else {
            response.redirect("/");
        }
    })
})

app.post('/elephants/destroy/:id', function(request, response) {
    Elephant.remove({_id:request.params.id}, function(err) {
        if(err) {
            console.log(elephanty.errors);
            res.render('/', {errors: elephanty.errors});
        } else { 
            response.redirect('/');
        }
    })
})

app.listen(8000, function() {
    console.log("listening on port 8000");
})