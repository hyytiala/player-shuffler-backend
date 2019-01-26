const personsRouter = require('express').Router()
const Person = require('../models/person')
const Game = require('../models/game')

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

personsRouter.get('/shuffled', async (req, res) => {
    const persons = await Person
        .find({})
    const list = persons.map(Person.format)
    res.json(shuffle(list))
})

personsRouter.get('/', async (req, res) => {
    const persons = await Person
        .find({})
    res.json(persons.map(Person.format))
})

personsRouter.get('/:id', async (req, res) => {
    let person = await Person
        .findById(req.params.id)
    const game = await Game
        .find({})
        .populate('order.player', { _id: 1, name: 1 })
        .populate('order.target', { _id: 1, name: 1 })
    person = Person.format(person)
    const found = game[0].order.find(element => element.player.name === person.name)
    person['target'] = found.target.name
    res.json(person)
})

personsRouter.post('/', async (req, res) => {
    try {
        const body = req.body
        if (body.name.length === 0) {
            return res.status(400).json({error: 'empty name'})
        }
        const existingPerson = await Person.find({name: body.name})
        if (existingPerson.length > 0) {
            return res.status(400).json({error: 'Name already taken'})
        }
        const pin = Math.random().toString(36).slice(-5);
        const person = new Person({
            name: body.name,
            alive: true,
            pin: pin
        })

        const savedPerson = await person.save()

        res.json(Person.format(savedPerson))
    } catch (exception) {
        console.log(exception)
        res.status(500).json({error: 'something went wrong...'})
    }
})

personsRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const person = await Person.findByIdAndUpdate(id, {alive: false}, { new: true })
        res.json(Person.format(person))
    } catch (exception) {
        console.log(exception)
        res.status(500).json({error: 'something went wrong...'})
    }
})

personsRouter.delete('/:id', async (req, res) => {
    try {
        await Person.findByIdAndRemove(req.params.id)
        await Game.deleteMany()
        res.status(204).end()
    } catch (exception) {
        console.log(exception)
        res.status(400).send({error: 'malformatted id'})
    }
})

module.exports = personsRouter