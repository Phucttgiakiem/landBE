const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "ap-southeast-2", // đổi theo region của bạn
  endpoint: "https://mos.ap-southeast-2.sufybkt.com", // endpoint trong dashboard
  credentials: {
    accessKeyId: process.env.SUFY_ACCESS_KEY,
    secretAccessKey: process.env.SUFY_SECRET_KEY,
  },
});

module.exports = s3;