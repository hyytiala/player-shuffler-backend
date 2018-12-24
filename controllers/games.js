const gamesRouter = require('express').Router()
const Game = require('../models/game')
const Person =require('../models/person')

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

gamesRouter.get('/', async (req, res) => {
    const games = await Game
        .find({})
        .populate('order.player', { _id: 1, name: 1 })
        .populate('order.target', { _id: 1, name: 1 })
    res.json(games.map(Game.format))
})

gamesRouter.post('/', async (req, res) => {
    try {
        const body = req.body

        const persons = await Person
            .find({})
        const list = shuffle(persons.map(function (person) {
            return person._id
        }))
        var orderList = []
        for (var i = 0; i < list.length - 1; i++) {
            var object = {
                player: list[i],
                target: list[i+1]
            }
            orderList.push(object)
        }
        const last = {
            player: list[list.length - 1],
            target: list[0]
        }
        orderList.push(last)

        const game = new Game({
            name: body.name,
            order: orderList
        })
        const savedGame = await game.save()
        res.json(Game.format(savedGame))
    } catch (exception) {
        console.log(exception)
        res.status(500).json({ error: 'something went wrong...' })
    }

})

module.exports = gamesRouter