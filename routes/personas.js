const express = require('express')
const router = express.Router()
const UserController = require('../controllers/personas.controller');

//Obtiene todos los tickets
router.get('/', UserController.findAllTickets);

//insert ticket
router.post('/insert', UserController.insertOneTicket);

module.exports = router