"use server";

import { validateRequest } from "@/server/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION ?? "",
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY ?? "",
  },
});

export async function getSignedURL() {
  const { user } = await validateRequest();

  if (!user) {
    return {
      failure: {
        message: "User not found",
      },
    };
  }

  const name = `myfile-${Date.now()}.jpg`;

  const putObjctCommand = new PutObjectCommand({
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME ?? "",
    Key: name,
  });

  const url = await getSignedUrl(s3, putObjctCommand, { expiresIn: 60 });

  const fileUrl = `https://${process.env.NEXT_AWS_S3_BUCKET_NAME || ""}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${name}`;

  return {
    sucess: {
      url,
      fileUrl,
    },
  };
}
