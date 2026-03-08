const express = require('express');
const upload = require('../middleware/upload.middleware');
const songContoller = require("../controllers/song.controller")


const router = express.Router()

// route to post all songs
router.post("/",upload.single("song"),songContoller.uploadSong)

router.get('/', songContoller.getSong)
module.exports = router