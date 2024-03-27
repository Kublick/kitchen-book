import { getRecipes } from "@/actions/recipe/get-recipes";
import Header from "@/components/header/TopBar";
import Image from "next/image";
export default async function Home() {
  const recipes = await getRecipes();

  return (
    <main className="flex flex-col min-h-screen">
      <Header />

      <h1>Nuevas Recetas</h1>
      <div>
        {recipes.map((recipe) => (
          <div key={recipe.id}>
            <h2>{recipe.title}</h2>
            <p>{recipe.description}</p>
            <Image
              src={recipe.Image[0].url}
              alt={recipe.title}
              width={300}
              height={300}
            />
          </div>
        ))}
      </div>

      <h1>Recetas mas buscadas</h1>
    </main>
  );
}
