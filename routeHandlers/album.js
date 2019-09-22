const Album = require('../models/Album');
const {validateCreateAlbumFields} = require('../validators/album');

exports.show_albums = async function(req, res, next){
	try{
		const albums = await Album.find(); 
		res.render('albums', { title: 'Albums', albums: albums, user: req.user, formData: req.body, errors: req.flash('albumCreateError') });
	}
	catch(err){
		res.redirect('/');
	}
};

exports.create_album = async function(req, res, next) {
	const {album_title, album_genre, album_releaseDate} = req.body;
	try{
		const errors = validateCreateAlbumFields(req);
		if(errors.length) throw new Error(errors);
		
		const existAlbum = await Album.findOne({
			"title": album_title,
			"genre": album_genre
		});
		if(existAlbum) throw new Error('album with the same title and genre already exists');

		await Album.create({
			title: album_title,
			genre: album_genre,
			releaseDate: album_releaseDate
		});
	}
	catch(err){
		req.flash('albumCreateError', err.message);
	}
	next();
}

exports.show_edit_album = async function(req, res, next) {
	try{
		const album = await Album.findOne({ _id: req.params.id });
		res.render('album/edit_album', { album: album, user: req.user, errors: req.flash('albumUpdateError') });
	}
	catch(err){
		res.redirect('/');
	};
}

exports.edit_album = async function(req, res, next) {
	const {album_title, album_genre, album_releaseDate} = req.body;
	try{
		const album = await Album.findOne({
			_id: req.params.id 
		});
		if(!album) throw new Error('album not exist');

		const duplicateAlbum = await Album.findOne({
			"title": album_title,
			"genre": album_genre,
			"_id": {$ne: req.params.id}
		});
		if(duplicateAlbum) throw new Error('The targeted title and genre combination already exists');

		const updatedAlbum = await Album.findOneAndUpdate(
			{ _id: req.params.id },
			{ $set: {
					"title": album_title,
					"genre": album_genre,
					"releaseDate": album_releaseDate
				} 
			},
			{new: true} // force return updated
		);
		if(!updatedAlbum) throw new Error('album update not succeed');
		
		res.redirect('/');
	}
	catch(err){
		req.flash('albumUpdateError', err.message);
		next();
	};
}

exports.delete_album = async function(req, res, next) {
	await Album.deleteOne({
		_id : req.params.id
	});
	res.send({ msg: "Success in deleting album" });//or return a json and verify in api callback
}