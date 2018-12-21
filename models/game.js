const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    name: String,
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }]
})

gameSchema.statics.format = (game) => {
    return {
        id: game.id,
        name: game.name,
        players: game.players,
    }
}

const Game = mongoose.model('Game', gameSchema)

module.exports = Game