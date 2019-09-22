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
        required: true
    }
});

const thisModel = 'Album';

AlbumSchema.statics.checkDuplicate = async function (query, sourceId, onSuccess, onError) {
    try{
        const album = await this.model(thisModel).findOne({
            $and:[
                query, 
                {$ne: sourceId}
            ]
        });

        if(onSuccess && typeof onSuccess === "function") {
            onSuccess();
        }

        return album;
    }
    catch(err){
        if(onError && typeof onError === "function"){
            onError(err);
        }
        return {error: err};
    }
};

module.exports = mongoose.model(thisModel, AlbumSchema);