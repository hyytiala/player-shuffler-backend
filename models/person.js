const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: String,
    alive: Boolean,
    pin: String
})

personSchema.statics.format = (user) => {
    return {
        id: user.id,
        name: user.name,
        alive: user.alive,
        pin: user.pin
    }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person