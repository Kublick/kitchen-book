import { getRecipes } from "@/actions/recipe/get-recipes";
import Header from "@/components/header/TopBar";

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
          </div>
        ))}
      </div>

      <h1>Recetas mas buscadas</h1>
    </main>
  );
}
