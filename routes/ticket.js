const express = require('express')
const router = express.Router()
const UserController = require('../controllers/ticket.controller');

//Obtiene todos los tickets
router.get('/', UserController.findAllTickets);

//obtiene los tickets filtrados por type
router.get('/type', UserController.findTicketsByType);

//obtiene los tickets por tipo y donde fue
router.get('/cualdondecuando', UserController.findCualDondeCuando);

//obtiene los tickets por typo y fecha
router.get('/cadaCuanto', UserController.findCadaCuanto);

//obtiene quien atiende mas tickets
router.get('/AtiendeMasTickets', UserController.findAtiendeMasTickets);

//hora de mas trabajo
router.get('/findHoraMasTrabajo', UserController.findHoraMasTrabajo);

//Tickets cerrados
router.get('/findClosedTickets', UserController.findClosedTickets);

//Tickets Abiertos
router.get('/findOpenTickets', UserController.findOpenTickets);

//Tickets desperfectos por zona
router.get('/finddesperfectosZona', UserController.finddesperfectosZona);

//Tickets que centro atiende por zonas
router.get('/findCentroAtencionPorZona', UserController.findCentroAtencionPorZona);

//Quien genera mas tickets
router.get('/findClienteMasTickets', UserController.findClienteMasTickets);

//Quien tiene tickets sin resolver
router.get('/findClienteTicketsPendientes', UserController.findClienteTicketsPendientes);

//Quien Es empleado y genero ticket
router.get('/findEmpleadoTicket', UserController.findEmpleadoTicket);

//insert ticket
router.post('/insert', UserController.insertOneTicket);

module.exports = router