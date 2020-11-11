const express = require('express');
const multer = require('multer');
const path = require('path');

const config = { data: { images: path.join(__dirname, './data/images') } };
const upload = multer({ limits: { size: 4 * 1024 * 1024 } });
const handleImage = (avatars) => async (req, res, next) => {
  if (!req.file) return next();
  if (req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpeg') {
    return next(new Error('File format is not supported'));
  }
  req.file.storedFilename = await avatars.store(req.file.buffer);
  return next();
};
const cors = require('cors');
const ImageService = require('./services/ImageServices');

const app = express();
const bodyParser = require('body-parser');

const images = new ImageService(config.data.images);

app.use(bodyParser.json());
app.use(cors());

app.post('/image', upload.single('image'), handleImage(images), (req, res, next) => {
  if (req.file && req.file.storedFilename) {
    // this we were save to user.avatar for example. remember to delete the image (images.delete(req.file.storedFileName)) if the user.save() errors
    console.log(req.file.storedFilename);
  }
  res.status(200).send('image uploaded');
});

app.listen(4000, () => {
  console.log('Running on port 4000');
});
