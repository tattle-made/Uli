const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: uuidv4 } = require("uuid");

const credentials = {
  accessKeyId: process.env.SERVICE_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.SERVICE_AWS_SECRET_ACCESS_KEY,
};
const bucketName = process.env.AWS_BUCKET_NAME;

const s3client = new AWS.S3({
  credentials,
});

const uploadData = async (data, fileName) => {
  // console.log("uploading data", bucketName);
  return new Promise((resolve) => {
    s3client.upload(
      {
        Bucket: bucketName,
        Key: fileName,
        Body: data,
      },
      (err, response) => {
        if (err) throw err;
        resolve(response);
      }
    );
  });
};

var upload = multer({
  storage: multerS3({
    s3: s3client,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    key: function (req, file, cb) {
      console.log(file);
      cb(null, `${uuidv4()}`); //use Date.now() for unique file keys
    },
  }),
});

module.exports = { uploadData, upload };
