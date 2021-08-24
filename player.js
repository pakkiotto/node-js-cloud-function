const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    _id:{
        type: Number
    },
    player_id: { 
        type: String
    },
    name: { 
        type: String
    },
    squad: { 
        type: String
    },
    role: { 
        type: String
    },
    roleDetailed: { 
        type: String
    },
    squad_id: { 
        type: String
    },
    number: { 
        type: String
    },
    nationality: [
        {
        type: String
        }
    ],
    marketValue: { 
        type: String
    }
});

module.exports = mongoose.model('Player', playerSchema);