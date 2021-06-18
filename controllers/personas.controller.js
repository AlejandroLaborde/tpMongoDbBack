const db = require('../models/db');

// Retrieve all users from the database.

exports.findAllTickets = (req, res) => {
    const collection = db.getInstance().collection('personas');

    collection.find().toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

exports.findPerson = (req, res) => {
    const dni = req.query.dni;
    const collection = db.getInstance().collection('personas');

    collection.find({dni:dni}).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};


exports.insertOneTicket = (req, res) => {
    
    const collection = db.getInstance().collection('personas');
    collection.insertOne(req.body).then(data => {
        res.send("Guardado con exito");
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};
