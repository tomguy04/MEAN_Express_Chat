// Import express and path modules.
var express = require( "express");
var path = require( "path");
// Create the express app.
var app = express();
// Define the static folder.
app.use(express.static(path.join(__dirname, "./static")));
// Setup ejs templating and define the views folder.
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
//body parser
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.urlencoded({ extended: true }));

//use session
// app.use(session({
//     secret: 'codingdojorocks', // string for encryption
//     resave:true,
//     saveUninitialized: true,
//     dateRequested = new Date()
// }));

//require session
var session = require('express-session');
//use session
app.use(session({secret: 'codingdojorocks'}));  // string for encryption

//**1
// Have the server render views/index.ejs that has the buttons for the user to click.
// Root route to render the index.ejs view.
app.get('/', function(request, response) {
    response.render("index");
})

//we are retrieving an object given to us from the 'app.listen' method (we named it 'server'), and we pass the 'server' object into the socket, listen method.
var server = app.listen(8000, function() {
    console.log("listening on port 8000");
});


//user object
class User {
    constructor(name, id) {
            this.name = name;
            this.id = id;
        }
    }

//the io object which we are going to use to control our sockets.
var io = require('socket.io').listen(server);
//users =[];
//we are going to set up the connection event. 
//Remember the order! Server and our port listener come first, the 'io' variable and require socket statement second, and last we'll have the io.sockets.on line as seen in the below snippet:

io.sockets.on('connection', function (socket, request, response) { //when a client connects, this code runs!
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    socket.on( "got_a_new_user", function (request,response){
        console.log(request.name);
        socket.broadcast.emit( 'new_user', {new_user_name: request.name});
        //var users = users || [];
        //req.session.user_name = req.name;

        //store the user info in a user object
        const myuser = new User(request.name, socket.id);
        console.log(`Create user -> ${myuser.name} ${myuser.id}`);
        //console.log(request.users);
        //return the user name and id back to the client.
        socket.emit('this_user',{response: myuser});
        })

    socket.on('posting_form', function (request,response){
        console.log(`${request.name} ${request.message}`);
    })
})