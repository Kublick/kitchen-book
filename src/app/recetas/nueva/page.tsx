import { CreateRecipeForm } from "@/components/recipes/CreateRecipe";
import prisma from "@/lib/prisma";
import React from "react";

const NewRecipe = async () => {
  const categories = await prisma.category.findMany();

  return (
    <div className="container mx-auto mt-8">
      <CreateRecipeForm categories={categories} />
    </div>
  );
};

export default NewRecipe;
