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
class Message {
    //constructor(name, message) {
    constructor(user, message) {
            //this.name = name;
            this.user = user;
            this.message = message;
            this.timeStamp = new Date();
        }
    }

class User {
    constructor(name, id) {
            this.name = name;
            this.id = id;
        }
    }

//the io object which we are going to use to control our sockets.
var io = require('socket.io').listen(server);
var allMessages =[];
var allUsers = [];
//we are going to set up the connection event. 
//Remember the order! Server and our port listener come first, the 'io' variable and require socket statement second, and last we'll have the io.sockets.on line as seen in the below snippet:

io.sockets.on('connection', function (socket, request, response) { //when a client connects, this code runs!
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    socket.on( "got_a_new_user", function (data){
        console.log(data.name);
        //socket.broadcast.emit( 'new_user', {new_user_name: request.name});
        const user = new User(data.name, socket.id);
        allUsers.push(user);
        //store the user info in a user object
        //const myuser = new User(request.name, socket.id);
        console.log(`Created user -> ${user.name} ${user.id}`);
        //console.log(io.broadcast);
        //console.log(socket.broadcast);
        //return the user name and id back to everyone but the new user.
        socket.broadcast.emit('userdata', user);

        //new user logs in sees all users
        socket.emit('allUsers', allUsers);
        //new user gets their name and id back within the user object.
        socket.emit('userDetails',user);
        //new user gets the message history.
        socket.emit('allMessages', allMessages);
    })



    socket.on('message', function (data){
        const user = allUsers.find(possibleUser => possibleUser.id === data.id) //if the user id in the array matches the id passed on the event, do something.
        //console.log(`Their name and message ${data.name} ${data.message}`);
        console.log(`Their name and message ${user.name} ${data.message}`);
        const newMessage = new Message(user, data.message);
        allMessages.push(newMessage);
        //socket.emit('messageBack',{messages: data.name, message: data.message, sid: socket.id});
        
        //socket.emit('messageBack',{messages: allMessages});
        //send back only new messages to everyone.
        io.emit('messageBack', newMessage);
        //console.log(data.name);
    })
    //a client closes their window:
    //socket.on
})