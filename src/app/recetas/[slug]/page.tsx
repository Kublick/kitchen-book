import { getRecipeBySlug } from "@/actions/recipe/get-recipe-by-slug";
import prisma from "@/lib/prisma";
import Image from "next/image";
import React from "react";

interface Props {
  params: {
    slug: string;
  };
}

interface Recipe {
  id: number;
  title: string;
  procedure: string;
  description: string;
  categoryId: number;
  cookTime: number;
  portions: number;
  prepTime: number;
  slug: string;
  ingredients: string;
}

const RecipeBySlug = async ({ params }: Props) => {
  const recipe = await getRecipeBySlug(params.slug);

  if (!recipe || recipe === null) {
    return <div>Receta no encontrada</div>;
  }

  const { ...r } = recipe.data;

  console.log(recipe);

  return (
    <div>
      <h1 className="my-4 sm:text-3xl md:text-5xl">{r.title}</h1>
      <div className="flex gap-4">
        <div className="flex gap-2">
          <p>Categoria</p>
          <p>{r.categoryId}</p>
        </div>
        <div className="flex gap-2">
          <p>Porciones</p>
          <p>{r.portions} </p>
        </div>
        <div className="flex gap-2">
          <p>Tiempo de coccion</p>
          <p>{r.cookTime} </p>
        </div>
      </div>
      <p>{r.description}</p>
      <div className="mt-4">
        <h1>Ingredientes</h1>
        <p
          className="leading-5"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: r.ingredients }}
        />
      </div>
      <div className="mt-4">
        <h1>Procedimiento</h1>
        <p
          className="leading-5"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: r.procedure }}
        />
      </div>
      <div className="my2 md:my-16 mx-auto">
        <h2 className="text-xl md:text-3xl text-center">Imagenes</h2>
        <div className="grid grid-cols-2 gap-8 mt-2 md:mt-8">
          {r.Image.map((img) => (
            <Image
              key={img.id}
              src={img.url}
              alt={r.title}
              width={600}
              height={600}
              className="rounded-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default RecipeBySlug;
