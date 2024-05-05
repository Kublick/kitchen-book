import prisma from "@/lib/prisma";

export const getRecipeBySlug = async (slug: string) => {
  try {
    const recipe = await prisma.recipe.findFirst({
      where: {
        slug: slug,
      },
      include: {
        Image: true,
      },
    });
    return {
      ok: true,
      data: recipe,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
};
