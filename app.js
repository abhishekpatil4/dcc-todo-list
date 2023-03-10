//Database dependencies
const { GridFSBucketWriteStream } = require('mongodb');
const mongoose = require('mongoose');


//to connect to database
mongoose.connect('mongodb+srv://abhishek:LcAK2Nrz1CejTIf7@cluster0.7k55j13.mongodb.net/?retryWrites=true&w=majority').then(() => {
    console.log("Connected to the database!");
})
    .catch(err => {
        console.log(err);
    });

const express = require('express');
const bodyParser = require('body-parser');


//Database Schema
const listSchema = new mongoose.Schema({
    content: String
});


// connecting to the collection using the collection name
const List = mongoose.model("todolist", listSchema);



const app = express();

//-----------------

const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'athar is bad',
  baseURL: 'http://localhost:3000',
  clientID: 'lA4bZt1HkFtkLzi7NsJ3W9H2KjfAxVNL',
  issuerBaseURL: 'https://dev-vn1vxohgj2ir030m.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});


//-----------------


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/home", function (req, res) {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = today.toLocaleDateString("en-US", options);

    List.find(function (err, items) {
        if (err) {
            console.log(err);
        } else {
            res.render('list', { kindOfDay: day, newListItems: items });        
        }
    });
});

app.post("/home", function (req, res) {
    var item = new List({
        content: req.body.newItem
    });
    if(item.content != ""){
        item.save();
    }
    res.redirect("/home");
})

// app.post("/logout", function (req, res) {
//     res.redirect("https://localhost:3000/logout");
// })

app.post("/delete", function (req, res) {
    List.findByIdAndRemove(req.body.checkbox, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("Item deleted ");
        }
     });
    res.redirect("/home");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
    console.log("Server started on port 3000");
});