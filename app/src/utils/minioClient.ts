import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_INTERNAL_ENDPOINT || "minio",
  port: Number(process.env.MINIO_INTERNAL_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY_ID || "minio",
  secretKey: process.env.MINIO_SECRET_KEY || "minio_secret_key",
});
