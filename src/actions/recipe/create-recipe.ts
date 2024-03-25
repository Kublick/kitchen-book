"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/server/auth";
import { z } from "zod";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3Client = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION ?? "",
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY ?? "",
  },
});

// NEXT_AWS_S3_REGION
// NEXT_AWS_S3_ACCESS_KEY_ID
// NEXT_AWS_S3_SECRET_ACCESS_KEY
// NEXT_AWS_S3_BUCKET_NAME

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
  ingredients: z.string().refine(
    (value) => {
      try {
        const parsed = JSON.parse(value);
        return (
          Array.isArray(parsed) &&
          parsed.every(
            (item) =>
              typeof item.name === "string" &&
              typeof item.amount === "number" &&
              item.amount > 0 &&
              [
                "GRAMOS",
                "KILOGRAMOS",
                "MILLILITROS",
                "LITROS",
                "CUCHARADA",
                "CUCHARADITA",
                "TAZA",
                "PIEZA",
                "PIZCA",
              ].includes(item.unit)
          )
        );
      } catch {
        return false;
      }
    },
    {
      message: "Invalid ingredients format",
    }
  ),
});

export const createRecipe = async (formData: FormData) => {
  const { user } = await validateRequest();
  console.log("🚀 ~ createRecipe ~ user:", user);

  const data = Object.fromEntries(formData);
  console.log("🚀 ~ createRecipe ~ data:", data);
  const recipeParse = recipeSchema.parse(data);

  const { ingredients, ...recipeData } = recipeParse;

  const recipe = await prisma.$transaction(async (prisma) => {
    let cloudinaryImage = "";
    if (formData.getAll("images")) {
      const images = await uploadImages(formData.getAll("images") as File[]);
      if (!images) {
        throw new Error("Error uploading images");
      }

      cloudinaryImage = images[0] ?? "";

      // await prisma.productImage.createMany({
      //   data: images.map((image) => ({
      //     url: image!,
      //     productId: product.id,
      //   })),
      // });
    }

    const saveRecipe = await prisma.recipe.create({
      data: {
        ...recipeData,
        imageUrl: cloudinaryImage,
        updatedAt: new Date(),
        userId: user?.id ?? "",
        Ingredient: {
          create: JSON.parse(ingredients),
        },
      },
    });

    console.log("🚀 ~ recipe ~ saveRecipe:", saveRecipe);

    return saveRecipe;
  });
};

const uploadImages = async (images: File[]) => {
  console.log("launching test");
  try {
    const uploadPromises = images.map(async (image) => {
      try {
        const buffer = await image.arrayBuffer();

        // use sharp on the image
        const resizedBuffer = await sharp(buffer)
          .png({ quality: 80 })
          .toBuffer();

        const params = {
          Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME ?? "",
          Key: `${Date.now()}-${image.name}`,
          Body: Buffer.from(resizedBuffer),
          ContentType: image.type,
        };

        const command = new PutObjectCommand(params);

        await s3Client.send(command);
        const imageUrl = `https://${params.Bucket}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${params.Key}`;
        return imageUrl;
      } catch (error) {
        console.log(error);
        return null;
      }
    });
    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
  } catch (error) {
    console.log(error);
    return null;
  }
};
