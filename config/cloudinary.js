const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'df3baj5zj',
  api_key: '222868893887637',
  api_secret: 'lwYWiENuuZ_VJJgY69FX0zqIF68',
});

async function cloudinaryUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: 'auto',
  });
  return res;
}

module.exports = cloudinaryUpload;
