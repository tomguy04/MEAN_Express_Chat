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
class userMessage {
    constructor(name, message) {
            this.name = name;
            this.message = message;
        }
    }

//the io object which we are going to use to control our sockets.
var io = require('socket.io').listen(server);
var allMessages =[];
//we are going to set up the connection event. 
//Remember the order! Server and our port listener come first, the 'io' variable and require socket statement second, and last we'll have the io.sockets.on line as seen in the below snippet:

io.sockets.on('connection', function (socket, request, response) { //when a client connects, this code runs!
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    socket.on( "got_a_new_user", function (data){
        console.log(data.name);
        //socket.broadcast.emit( 'new_user', {new_user_name: request.name});

        //store the user info in a user object
        //const myuser = new User(request.name, socket.id);
        console.log(`Created user -> ${data.name} ${socket.id}`);
  ;
        //return the user name and id back to the client.
        socket.emit('userdata',{name: data.name, sid: socket.id});
        })

    socket.on('message', function (data, res){
        //console.log(`Their name and message ${data.name} ${data.message}`);
        newMessage = new userMessage(data.name, data.message);
        allMessages.push(newMessage);
        //socket.emit('messageBack',{messages: data.name, message: data.message, sid: socket.id});
        socket.emit('messageBack',{messages: allMessages});
        //console.log(data.name);
    })
})