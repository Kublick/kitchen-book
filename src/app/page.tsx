import { getRecipes } from "@/actions/recipe/get-recipes";
import Header from "@/components/header/TopBar";
import Image from "next/image";
import Link from "next/link";
export default async function Home() {
  const recipes = await getRecipes();

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto mt-4">
        <h1 className="text-3xl mt-4">Top Recetas</h1>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 mt-8 gap-4">
          {recipes.map((recipe) => (
            <div key={recipe.id}>
              <Link href={`/recetas/${recipe.slug}`}>
                <h2 className="text-xl hover:underline">{recipe.title}</h2>
              </Link>
              <div className="h-[300px] bg-red-600">
                {recipe.Image.length === 0 ? (
                  <Image
                    src={"/noimage.jpeg"}
                    alt="Sin imagen"
                    height={300}
                    width={300}
                    className="fit"
                  />
                ) : (
                  <Image
                    src={recipe.Image[0].url}
                    alt={recipe.title}
                    width={300}
                    height={300}
                    className="my-2 rounded-sm cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
