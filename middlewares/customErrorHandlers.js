const createError = require('http-errors');

exports.logErrorHandler = function(err, req, res, next){
    console.error(err.stack);
    next(err);
}

exports.xhrErrorHandler = function(err, req, res, next){
    if(req.xhr){
        res.status(500).send({error: 'Something is wrong'})
    }
    else{
        next(err);
    }
}

exports.notFoundErrorHandler = function(err, req, res, next){
    next(createError(404, 'You are entering a secret nuclear site in China, all albums are nuked!')); 
}

exports.finalErrorHandler = function(err, req, res, next){
    // must delegate to the default Express error handler, when the headers have already been sent
    if(res.headersSent){
        return next(err);
    }

    res.status(err.status || 500);
    res.render('error', {error: err});
}