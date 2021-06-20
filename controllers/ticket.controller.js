const db = require('../models/db');

// Retrieve all users from the database.
exports.findAllTickets = (req, res) => {
    const collection = db.getInstance().collection('tickets');
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    var query={}
    if(dateFrom && dateTo){
       query = {dateCreate: { $gte: dateFrom, $lte: dateTo } }
    }
    collection.find(query).toArray().then(data => {
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
    
    const collection = db.getInstance().collection('tickets');
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

exports.findTicketsByType = (req, res) => {
    const type = req.query.type;
    const dateTo = req.query.dateTo;
    const dateFrom = req.query.dateFrom;
    const collection = db.getInstance().collection('tickets');
    var query = {};
    if( type && type != 'all'){
        query = {$and:[{type: type}, {dateCreate:{$gte:dateFrom }},{dateCreate:{$lte: dateTo}}]}
    }
    console.log(query)
    collection.find(query).toArray().then(data => {
        console
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

exports.findCualDondeCuando = (req, res) => {
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    var query={}
    if(dateFrom && dateTo){
       query = {$and:[{dateCreate:{$gte:dateFrom }},{dateCreate:{$lte: dateTo}}]}
    }
    const collection = db.getInstance().collection('tickets');
    console.log(query)
    collection.aggregate([
        {$match:query},
        { $addFields: { direccion: { $first: "$usuarioCreacion.domicilios" } } },
        {$project: {type: 1, localidad:"$direccion.localidad"}}
        ]).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

exports.findCadaCuanto = (req, res) => {
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    var query={}
    if(dateFrom && dateTo){
       query = {$and:[{dateCreate:{$gte:dateFrom }},{dateCreate:{$lte: dateTo}}]}
    }
    const collection = db.getInstance().collection('tickets');
    collection.aggregate([
        {$match:query},
        {$project: {type: 1, dateCreate:1}},
        {$group:{_id:{type:"$type",dateCreate:"$dateCreate"}}}
        ]).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};


exports.findAtiendeMasTickets = (req, res) => {
    const collection = db.getInstance().collection('tickets');
    collection.aggregate(
        [
            {$project: {empleado: "$derivaciones.usuario"}},
            {$unwind: "$empleado"},
            {$group: { _id: "$empleado.dni", cantidadTickets: {$sum:1}}},
			{$sort: {cantTickets: -1}}
        ]
        ).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};


exports.findHoraMasTrabajo = (req, res) => {
    const collection = db.getInstance().collection('tickets');
    collection.aggregate(
        [
            { $project : { fecha : { $split: ["$dateCreate", "T"] }} },
			{ $unwind : "$fecha" },
			{ $match : { fecha : /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/ } },
            {$group: { _id: "$fecha", cantidadTickets: {$sum:1}}},
			{$sort: {cantTickets: -1}}
        ]
        ).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};


exports.findClosedTickets = (req, res) => {
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    var query={}
    if(dateFrom && dateTo){
       query = {$and:[{dateCreate:{$gte:dateFrom }},{dateCreate:{$lte: dateTo}}]}
    }
    const collection = db.getInstance().collection('tickets');
    collection.aggregate(
        [   
            { $match: query },
            { $match : { state : "close"} }
        ]
        ).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};


exports.findOpenTickets = (req, res) => {
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    var query={}
    if(dateFrom && dateTo){
       query = {$and:[{dateCreate:{$gte:dateFrom }},{dateCreate:{$lte: dateTo}}]}
    }
    const collection = db.getInstance().collection('tickets');
    collection.aggregate(
        [
            { $match: query },
            { $match : { state : "open"} }
        ]
        ).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

exports.finddesperfectosZona = (req, res) => {
    const collection = db.getInstance().collection('tickets');
    collection.aggregate(
        [
            { $addFields: { direccion: { $first: "$usuarioCreacion.domicilios" } } },
            { $project: { type: 1, zona : "$direccion.localidad.nombre"} },
			{ $group: {_id:"$zona", motivo:  {$addToSet:  "$type" } } }
        ]
        ).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};


exports.findCentroAtencionPorZona = (req, res) => {
    const collection = db.getInstance().collection('tickets');
    collection.aggregate(
        [
			{ $addFields: { direccion: { $first: "$usuarioCreacion.domicilios" } } },
            { $unwind: "$derivaciones"},
			{ $project: {zona:"$direccion.localidad.nombre",central: "$derivaciones.usuario.central.tipo"}},
			{ $group: {_id:"$zona", motivo:  {$addToSet:  "$central" } } }
        ]
        ).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

exports.findClienteMasTickets = (req, res) => {
    const collection = db.getInstance().collection('tickets');
    collection.aggregate(
        [
			{ $project: {cliente:"$usuarioCreacion.dni"}},
			{ $group: {_id:"$cliente", cantTickets : {$sum : 1} } },
			{ $sort: {cantTickets: -1} }
        ]
        ).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

exports.findClienteTicketsPendientes = (req, res) => {
    const collection = db.getInstance().collection('tickets');
    collection.aggregate(
        [
			{ $match: {state : "open"}	},
			{ $project: {cliente:"$usuarioCreacion.dni"}},
			{ $group: {_id:"$cliente"}}
        ]
        ).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

exports.findEmpleadoTicket = (req, res) => {
    const collection = db.getInstance().collection('tickets');
    collection.aggregate(
        [
            { $match: {"usuarioCreacion.esEmpleado" : true}	},
			{ $project: {usuarioCreacion:1}}
        ]
        ).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};


exports.obtenerZonasCreacionTickets = (req, res) => {
    
    const collection = db.getInstance().collection('tickets');
    collection.aggregate([
        {$match:query},
        { $addFields: { direccion: { $first: "$usuarioCreacion.domicilios" } } },
        {$project: {type: 1, localidad:"$direccion.localidad"}}
        ]).toArray().then(data => {
          res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};
//Cliente mas cercano a el Atencion al Cliente

exports.clienteMasCercanoAtencionCliente = (req, res) => {
    const collection = db.getInstance().collection('tickets');

    collection.createIndex({"usuarioCreacion.domicilios.geometry" : "2dsphere"})
    var atencion = collection.aggregate([
		{
			$match:{ "derivaciones.usuario.central.tipo": "Atencion al Cliente" }
		},
		{
			$project : {centro:"$derivaciones.usuario.central"}
		},
		{
			$unwind: "$centro"
		},
		{ $limit : 1 }
	]).toArray()

    atencion.then(data=>{
        console.log(data[0].centro)
        collection.aggregate([ 
            {
                $geoNear: {
                    near: data[0].centro.geometry,
                    distanceField: "dist.calculated",
                }
            },
            {
                $project:{cliente:"$usuarioCreacion"}
            },
            { $limit : 1 }
        ]
            ).toArray().then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving users."
                });
            });


    })
    
};