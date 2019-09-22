exports.validateCreateAlbumFields = function(req) {
	const errors = [];
	if (/^\s*$/.test(req.body.album_title)) {
		errors.push("missing title");
	}
	if (/^\s*$/.test(req.body.album_genre)) {
		errors.push("missing genre");
	}
	if (/^\s*$/.test(req.body.album_releaseDate)) {
		errors.push("missing date");
	}

	return errors.join(', ');
}