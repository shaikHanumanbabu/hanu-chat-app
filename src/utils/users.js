const users = []

//  addUser, removeUser, getUser, getUsersInRoom

exports.addUser = ({id, username, room}) => {
    // clean the data
    debugger
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room) {
        return {
            error : 'User name and Room are required'
        }
    }
    //check for existing user
    const existingUser = users.find((user) => {
        return user.room == room && user.username == username
    })

    if(existingUser) {
        return {
            error : 'A user name already existed'
        }
    }
    const user = {id, username, room}
    users.push(user)
    return {user}
}

exports.removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if(index != -1) {
        return users.splice(index, 1)[0]
    }
}

exports.getUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    return users[index];
    // if(index != -1) {
    //     return users.splice(index, 1)[0]
    // }
}

exports.getUsersInRoom = (room) => {
    const userInRoom = users.filter((user) => {
        return user.room == room
    })
    if(userInRoom.length) {
        return userInRoom
    }
    else {
        return []
    }
}



