

const songModel = require("../models/song.model")
const storageService = require("../services/storage.service")
const id3 = require("node-id3")


async function uploadSong(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Missing required file field "song"' })
    }

    const songBuffer = req.file.buffer
    const { mood } = req.body

    const tags = id3.read(songBuffer) || {}
// Validate that the required metadata fields are present
    if (!tags.title) {
      return res.status(400).json({ message: "Unable to read track title from uploaded file" })
    }

    if (!tags.image || !tags.image.imageBuffer) {
      return res.status(400).json({ message: "Uploaded file does not contain embedded artwork (ID3 image tag)" })
    }

    const [songFile, posterFile] = await Promise.all([
      storageService.uploadFile({
        buffer: songBuffer,
        filename: `${tags.title}.mp3`,
        folder: "songs"
      }),
      storageService.uploadFile({
        buffer: tags.image.imageBuffer,
        filename: `${tags.title}.jpeg`,
        folder: "posters"
      })
    ])

    const song = await songModel.create({
      title: tags.title,
      url: songFile.url,
      posterUrl: posterFile.url,
      mood
    })

    res.status(201).json({
      message: "song created successfully",
      song
    })
  } catch (error) {
    console.error('uploadSong error:', error)
    res.status(500).json({ message: 'Failed to upload song', error: error.message })
  }
}

async function getSong(req, res) {

    const { mood } = req.query

    const song = await songModel.findOne({
        mood,
    })

    res.status(200).json({
        message: "song fetched successfully.",
        song,
    })

}


module.exports = { uploadSong, getSong }