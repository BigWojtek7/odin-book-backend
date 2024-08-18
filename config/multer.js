const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'||
      file.mimetype === 'image/webp'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only images(.png, .jpg, .jpeg, .webp)!'));
    }
  },
});

module.exports = upload;
