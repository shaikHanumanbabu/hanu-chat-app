const socket = io()

// socket.on('countUpdated', (count) => {
//     console.log('the count has been updated', count);
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicked');
//     socket.emit('increment')
// })
// const form = document.querySelector('form')
// console.log(form, 'formmmmmmmmmmmmm');

// form.onsubmit = checkForm
// function checkForm() {
//     // debugger
//     // console.log('welocme');
//     // e.preventDefault()
//     return false
// }

//  elements 
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('#message')
const $messageFormButton = document.querySelector('#send_message')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates

const $messageTemplates = document.querySelector('#message-template').innerHTML
const $locationMessageTemplates = document.querySelector('#location-message-template').innerHTML
const $sidebarTemplates = document.querySelector('#sidebar-template').innerHTML

// Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix : true})

const autoscroll = () => {
    // New Message
    const $newMessage = $messages.lastElementChild

    // height of the message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $messages.offsetHeight
    // height of message cotainer
    const containerHeight = $messages.scrollHeight

    // how far scroll
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
    console.log(newMessageStyle);
}
// console.log(username);
// const user = usernamedetails[0]
// const room = usernamedetails[1]

// console.log(user);
// console.log(room);

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
        let message = $messageFormInput.value
        socket.emit('sendMessage', message, (err) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
            if(err)
                return console.log('Please check your message');
            
            console.log('delivered');
        })
})

$locationButton.addEventListener('click', (e) => {
    if(!navigator.geolocation) {
        return alert('Your Browser doesn\t support getlocation feature')
    }
    $locationButton.setAttribute('disabled', true)
    navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit('sendLocation', {latitude, longitude}, () => {
            $locationButton.removeAttribute('disabled')

            console.log('Location shared');
        })
    })
})

socket.on('locationmessage', (url) => {
    const html = Mustache.render($locationMessageTemplates, {
        username: url.username,
        url: url.text,
        createdAt: moment(url.createdAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render($sidebarTemplates, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})
socket.on('sendWelcomeMessage', (message) => {

    const html = Mustache.render($messageTemplates, {
        username : message.username,
        message : message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()

}, () => {
    console.log('A message delivered');
})


socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error)
        window.location.href = '/'
    }
})