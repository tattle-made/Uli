const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: uuidv4 } = require("uuid");

const credentials = {
  accessKeyId: process.env.SERVICE_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.SERVICE_AWS_SECRET_ACCESS_KEY,
};
const bucketName = process.env.AWS_BUCKET_NAME;

const s3client = new S3Client({
  credentials,
});

const uploadData = async (data, fileName) => {
  // console.log("uploading data", bucketName);
  const uploadS3 = await s3client.upload({
    Bucket: bucketName,
    Key: fileName,
    Body: data,
  });

  try {
    const response = uploadS3();
    resolve(response);
  } catch (err) {
    if (err) {
      throw err;      
    }
  }
};

var upload = multer({
  storage: multerS3({
    s3: s3client,
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
      console.log(file);
      cb(null, `${uuidv4()}`); //use Date.now() for unique file keys
    },
  }),
  limits: {
    fileSize: 8000000
  }
});

module.exports = { uploadData, upload };
