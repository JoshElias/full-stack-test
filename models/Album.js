var mongoose = require('mongoose');

const AlbumSchema = mongoose.Schema({
    title: {
        type: String,
        required: true 
    },
    genre: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('Album', AlbumSchema);