"use server";

import prisma from "@/lib/prisma";

export const getRecipes = async () => {
  try {
    const recipes = await prisma.recipe.findMany({});
    return recipes;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener las recetas");
  }
};
