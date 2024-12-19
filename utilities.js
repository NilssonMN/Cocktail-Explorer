export function mapRawCocktailData(rawCocktial) {
    return {
      id: rawCocktial.idDrink,
      name: rawCocktial.strDrink,
      tags: rawCocktial.strTags ? rawCocktial.strTags.split(",") : [],
      category: rawCocktial.strCategory,
      alcoholic: rawCocktial.strAlcoholic === "Alcoholic",
      glass: rawCocktial.strGlass,
      instructions: rawCocktial.strInstructions,
      thumbnail: rawCocktial.strDrinkThumb,
      ingredients: Array.from({ length: 15 })
        .map((_, i) => ({
          ingredient: rawCocktial[`strIngredient${i + 1}`],
          measure: rawCocktial[`strMeasure${i + 1}`],
        }))
        .filter((item) => item.ingredient),
    };
  }