const express = require('express');
const router = express.Router();

const albumAPI = require('../routeHandlers/album');
const user = require('../routeHandlers/user');

const {isLoggedIn} = require('../middlewares/userAuth');

router.get('/login', user.show_login);
router.post('/login', user.login);

router.get('/signup', user.show_signup);
router.post('/signup', user.signup);

router.get('/logout', user.logout);

router.get('/', albumAPI.show_albums);
router.post('/', isLoggedIn, albumAPI.create_album, albumAPI.show_albums);

router.get('/:id/edit', isLoggedIn, albumAPI.show_edit_album);
router.post('/:id/edit', isLoggedIn, albumAPI.edit_album, albumAPI.show_edit_album);

router.post('/:id/delete', isLoggedIn, albumAPI.delete_album);

module.exports = router;