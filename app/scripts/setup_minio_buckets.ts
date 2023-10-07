const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: "minio",
  port: 9000,
  useSSL: false,
  accessKey: "minio",
  secretKey: "minio_secret_key",
});

minioClient.makeBucket("k-next", "us-east-1");
