const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')
const app =  express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public'); 

app.use(express.static(publicDirectoryPath))
// app.get('/', function(req, res) {

// })
console.log(typeof generateMessage);
io.on('connection', (socket) => {
    // console.log('new connection');
    // socket.emit('countUpdated', count)
    // socket.on('increment', () => {
    //     count++;
    //     // socket.emit('countUpdated', count)
    //     io.emit('countUpdated', count)

    // })
    socket.on('join', (options, callback) => {
        const {error, user} = addUser({id: socket.id, ...options})
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('sendWelcomeMessage', generateMessage(user.username, 'Welcome'))
        socket.broadcast.to(user.room).emit('sendWelcomeMessage', generateMessage(user.username,` has joined`))
        io.to(user.room).emit('roomData', {room : user.room, users : getUsersInRoom(user.room)})
        // socket.emit send notificatin to current user
        // socket.join creates a room
        // socket.broadcast.emit send notificatin to all user except current user
        // io.emit send notificatin to all user
        // io.to.emit send notification to perticular room
        // socket.broadcast.to.emit send notification all room members except this person
        callback()
    })

    socket.on('sendMessage', (data, callback) => {
        const user = getUser(socket.id)

        const filter = new Filter()
        if(filter.isProfane(data)) {
            return callback('A profinity word existed')
        }
        io.to(user.room).emit('sendWelcomeMessage', generateMessage( user.username, data))
        callback()
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user)
            io.to(user.room).emit('sendWelcomeMessage', generateMessage(`${user.username} has left`))
            io.to(user.room).emit('roomData', {room : user.room, users : getUsersInRoom(user.room)})

    })

    socket.on('sendLocation', (data, callback) => {
        const user = getUser(socket.id)
        console.log('send location ', user);
        io.to(user.room).emit('locationmessage', generateLocationMessage(user.username,`https://google.com/maps?q=${data.latitude},${data.longitude}`))
        callback()
    })
})
server.listen(port, () => {
    console.log(`server running at ${port}`);
})