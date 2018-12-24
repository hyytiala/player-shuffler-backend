const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    name: String,
    order: [{
        player: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
        target: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'}
    }]
})

gameSchema.statics.format = (game) => {
    return {
        id: game.id,
        name: game.name,
        order: game.order,
    }
}

const Game = mongoose.model('Game', gameSchema)

module.exports = Game