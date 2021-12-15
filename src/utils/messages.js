exports.generateMessage = (username = '', text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

exports.generateLocationMessage = (username, text = '') => {
    return {

        username,
        text,
        createdAt : new Date().getTime()
    }
}
