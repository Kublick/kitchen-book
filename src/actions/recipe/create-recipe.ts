"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/server/auth";
import { z } from "zod";

import sharp from "sharp";
import { getSignedURL } from "../aws/s3actions";

const recipeSchema = z.object({
  title: z.string().min(1, {
    message: "El titulo es requerido.",
  }),
  portions: z.coerce
    .number()
    .min(1)
    .transform((val) => Number(val)),
  prepTime: z.coerce
    .number()
    .min(1)
    .transform((val) => Number(val)),

  cookTime: z.coerce
    .number()
    .min(1)
    .transform((val) => Number(val)),
  procedure: z.string({ required_error: "El procedimiento es requerido." }),
  description: z.string({ required_error: "La descripcion es requerida." }),
  categoryId: z.coerce
    .number()
    .min(1)
    .transform((val) => Number(val)),
  //   images: z.custom<File[]>().nullable(),
  ingredients: z.string(),
});

export const createRecipe = async (formData: FormData) => {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("User not found");
  }
  const data = Object.fromEntries(formData);
  const recipeParse = recipeSchema.parse(data);
  const { ingredients, ...recipeData } = recipeParse;
  await prisma.$transaction(async (prisma) => {
    const images = formData.getAll("images");
    if (!images) {
      throw new Error("No images found");
    }
    const uploadPromises = images.map(async (image) => {
      const getSignedResponse = await getSignedURL();

      if (getSignedResponse?.failure) {
        throw new Error("Error getting signed url");
      }

      const { url, fileUrl } = getSignedResponse.sucess;

      await fetch(url, {
        method: "PUT",
        body: image as File,
        headers: {
          "Content-Type": (image as File)?.type,
        },
      });

      return fileUrl;
    });
    const promisesResult = await Promise.all(uploadPromises);
    const saveRecipe = await prisma.recipe.create({
      data: {
        ...recipeParse,
        updatedAt: new Date(),
        userId: user?.id ?? "",
        Image: {
          create: promisesResult.map((url) => {
            return {
              url,
            };
          }),
        },
      },
    });

    return saveRecipe;
  });
};

// const uploadImages = async (images: File[]) => {
//   try {
//     const uploadPromises = images.map(async (image) => {
//       try {
//         const buffer = await image.arrayBuffer();

//         // use sharp on the image
//         const resizedBuffer = await sharp(buffer)
//           .png({ quality: 80 })
//           .toBuffer();

//         const params = {
//           Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME ?? "",
//           Key: `${Date.now()}-${image.name}`,
//           Body: Buffer.from(resizedBuffer),
//           ContentType: image.type,
//         };

//         const command = new PutObjectCommand(params);

//         await s3Client.send(command);
//         const imageUrl = `https://${params.Bucket}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${params.Key}`;
//         return imageUrl;
//       } catch (error) {
//         console.log(error);
//         return null;
//       }
//     });
//     const uploadedImages = await Promise.all(uploadPromises);
//     return uploadedImages;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };
