const gamesRouter = require('express').Router()
const Game = require('../models/game')

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
    res.json(games.map(Game.format))
})

gamesRouter.post('/', async (req, res) => {
    const persons = await Person
        .find({})
    const list = shuffle(persons.map(Person.format))
    res.json(list)
})

module.exports = gamesRouter