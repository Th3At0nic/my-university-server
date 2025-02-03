import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';

// Function to delete file after successful upload
const deleteFile = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Failed to delete file:', err);
    } else {
      console.log('File deleted successfully');
    }
  });
};

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret, // Click 'View API Keys' above to copy your API secret
});

export const sendImageToCloudinary = async (
  imgPath: string,
  imgName: string,
) => {
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(imgPath, {
      public_id: imgName,
    })
    .catch((error) => {
      console.log('uploadResult err: ', error);
    });

  if (uploadResult) {
    deleteFile(imgPath);
  }

  return uploadResult;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
