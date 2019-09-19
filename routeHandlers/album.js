const Album = require('../models/Album');

exports.show_albums = async function(req, res, next){
	try{
		const albums = await Album.find(); 
		res.render('albums', { title: 'Albums', albums: albums, user: req.user });
	}
	catch(err){
		res.redirect('/');
	}
};

exports.create_album = async function(req, res, next) {
	const {album_title, album_genre, album_releaseDate} = req.body;
	await Album.create({
		title: album_title,
		genre: album_genre,
		releaseDate: album_releaseDate
	})
	next();
}

exports.show_edit_album = async function(req, res, next) {
	try{
		const album = await Album.findOne({ _id: req.params.id });
		res.render('album/edit_album', { album: album, user: req.user });
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
		if(!album) throw new Error();
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
		if(!updatedAlbum) throw new Error();
		// res.json(updatedAlbum);
		res.redirect('/');
	}
	catch(err){
		res.json({message: "wrong in update album"})
	};
}

exports.delete_album = async function(req, res, next) {
	await Album.deleteOne({
		_id : req.params.id
	});
	res.send({ msg: "Success in deleting album" });//or return a json and verify in api callback
}