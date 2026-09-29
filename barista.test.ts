import { describe, expect, it } from "vitest";
import { Barista, Coffee, Ingredient } from "./barista";

describe("Coffee", () => {
  // cas de succès

  // Vérifie que le constructeur initialise bien le nom et le prix
  it("crée un café avec un nom et un prix", () => {
    const coffee = new Coffee("Cappuccino", 4);

    expect(coffee.name).toBe("Cappuccino");
    expect(coffee.price).toBe(4);
  });

  // Vérifie qu'un ingrédient ajouté apparaît dans la recette du café
  it("ajoute un ingrédient à la recette", () => {
    const coffee = new Coffee("Cappuccino", 4);
    coffee.addIngredient("lait", 2);

    expect(coffee.ingredients).toEqual([{ name: "lait", quantity: 2 }]);
  });

  // Vérifie que le prix d'un café est toujours un nombre strictement positif
  it("le prix d'un café est un nombre positif", () => {
    const coffee = new Coffee("Cappuccino", 4);

    expect(coffee.price).toBeGreaterThan(0);
  });
});

describe("Ingredient", () => {
  // cas de succès

  // Vérifie que la quantité augmente correctement
  it("ajoute une quantité au stock", () => {
    const ingredient = new Ingredient("café", 5);
    ingredient.addQuantity(3);

    expect(ingredient.quantity).toBe(8);
  });

  // Vérifie que la quantité diminue correctement
  it("retire une quantité du stock", () => {
    const ingredient = new Ingredient("café", 5);
    const success = ingredient.removeQuantity(2);

    expect(success).toBe(true);
    expect(ingredient.quantity).toBe(3);
  });

  // cas limite

  // Vérifie qu'on ne peut pas retirer plus que le stock disponible
  it("refuse de retirer une quantité supérieure au stock", () => {
    const ingredient = new Ingredient("café", 5);
    const success = ingredient.removeQuantity(10);

    expect(success).toBe(false);
    expect(ingredient.quantity).toBe(5);
  });

  // Vérifie que retirer exactement tout le stock fonctionne (le stock tombe à 0)
  it("accepte de retirer une quantité égale au stock", () => {
    const ingredient = new Ingredient("café", 5);
    const success = ingredient.removeQuantity(5);

    expect(success).toBe(true);
    expect(ingredient.quantity).toBe(0);
  });
});

describe("Barista", () => {
  // cas de succès

  // Vérifie que le café ajouté se retrouve dans la liste
  it("ajoute un café à sa liste de cafés", () => {
    const barista = new Barista("Fanny");
    const coffee = new Coffee("Espresso", 2);
    barista.addCoffee(coffee);

    expect(barista.listCoffees()).toContain(coffee);
  });

  //Vérifie qu'un tableau contient un objet avec la même structrure
  it("le stock contient un ingrédient avec la bonne quantité après ajout", () => {
    const barista = new Barista("Fanny");
    barista.addIngredient("café", 5);

    expect(barista.ingredients).toContainEqual(new Ingredient("café", 5));
  });

  it("retrouve un café existant par son nom", () => {
    const barista = new Barista("Fanny");
    const coffee = new Coffee("Espresso", 2);
    barista.addCoffee(coffee);

    expect(barista.getCoffee("Espresso")).toBe(coffee);
  });

  // Vérifie que getCoffee retourne bien un objet de type Coffee
  it("retourne une instance de Coffee via getCoffee", () => {
    const barista = new Barista("Fanny");
    const coffee = new Coffee("Espresso", 2);
    barista.addCoffee(coffee);

    expect(barista.getCoffee("Espresso")).toBeInstanceOf(Coffee);
  });

  // Vérifie que la quantité s'additionne au stock existant au lieu de créer un doublon
  it("additionne la quantité lorsqu'on ajoute un ingrédient déjà en stock", () => {
    const barista = new Barista("Fanny");
    barista.addIngredient("café", 5);
    barista.addIngredient("café", 3);

    const cafeStock = barista.ingredients.find((i) => i.name === "café");

    expect(barista.ingredients.length).toBe(1);
    expect(cafeStock?.quantity).toBe(8);
  });

  // Vérifie que canMakeCoffee détecte un stock suffisant pour tous les ingrédients
  it("peut préparer un café lorsque tous les ingrédients sont disponibles", () => {
    const barista = new Barista("Fanny");
    const coffee = new Coffee("Cappuccino", 4);
    coffee.addIngredient("café", 1);
    coffee.addIngredient("lait", 2);

    barista.addIngredient("café", 5);
    barista.addIngredient("lait", 5);

    expect(barista.canMakeCoffee(coffee)).toBe(true);
  });

  // Vérifie la valeur de retour de makeCoffee en cas de succès
  it("retourne true lorsqu'il prépare un café avec succès", () => {
    const barista = new Barista("Fanny");
    const coffee = new Coffee("Cappuccino", 4);
    coffee.addIngredient("café", 1);
    coffee.addIngredient("lait", 2);

    barista.addIngredient("café", 5);
    barista.addIngredient("lait", 5);

    expect(barista.makeCoffee(coffee)).toBe(true);
  });

  // Vérifie que le stock diminue de la bonne quantité après la préparation
  it("consomme les ingrédients lorsqu'il prépare un café", () => {
    const barista = new Barista("Fanny");
    const coffee = new Coffee("Cappuccino", 4);
    coffee.addIngredient("café", 1);
    coffee.addIngredient("lait", 2);

    barista.addIngredient("café", 5);
    barista.addIngredient("lait", 5);

    barista.makeCoffee(coffee);

    const cafeStock = barista.ingredients.find((i) => i.name === "café");
    const laitStock = barista.ingredients.find((i) => i.name === "lait");

    expect(cafeStock?.quantity).toBe(4);
    expect(laitStock?.quantity).toBe(3);
  });

  // Vérifie que orderCoffee retourne le prix une fois le café préparé
  it("retourne le prix lorsqu'un café est commandé", () => {
    const barista = new Barista("Fanny");
    const coffee = new Coffee("Cappuccino", 4);
    coffee.addIngredient("café", 1);
    coffee.addIngredient("lait", 2);

    barista.addCoffee(coffee);
    barista.addIngredient("café", 5);
    barista.addIngredient("lait", 5);

    const price = barista.orderCoffee("Cappuccino");

    expect(price).toBe(4);
  });

  // cas d'erreur

  // Vérifie que getCoffee retourne undefined si le café est inconnu
  it("retourne undefined lorsqu'un café n'existe pas", () => {
    const barista = new Barista("Fanny");

    expect(barista.getCoffee("Inconnu")).toBeUndefined();
  });

  // Vérifie que orderCoffee retourne null si le café est inconnu
  it("retourne null lorsqu'on commande un café qui n'existe pas", () => {
    const barista = new Barista("Fanny");

    expect(barista.orderCoffee("Inconnu")).toBeNull();
  });

  // Vérifie que orderCoffee retourne null si les ingrédients ne sont pas suffisants
  it("retourne null lorsqu'on commande un café sans avoir les ingrédients", () => {
    const barista = new Barista("Fanny");
    const coffee = new Coffee("Cappuccino", 4);
    coffee.addIngredient("café", 1);
    coffee.addIngredient("lait", 2);

    barista.addCoffee(coffee);
    barista.addIngredient("café", 5);

    expect(barista.orderCoffee("Cappuccino")).toBeNull();
  });

  // Le lait n'a jamais été ajouté au stock du barista : canMakeCoffee doit refuser
  it("ne peut pas préparer un café lorsqu'un ingrédient est manquant", () => {
    const barista = new Barista("Fanny");
    const coffee = new Coffee("Cappuccino", 4);
    coffee.addIngredient("café", 1);
    coffee.addIngredient("lait", 2);

    barista.addIngredient("café", 5);

    expect(barista.canMakeCoffee(coffee)).toBe(false);
  });

  // Le lait n'a jamais été ajouté au stock : le café ne doit pas être préparé, ni le stock modifié
  it("ne consomme rien lorsqu'il ne peut pas préparer le café", () => {
    const barista = new Barista("Fanny");
    const coffee = new Coffee("Cappuccino", 4);
    coffee.addIngredient("café", 1);
    coffee.addIngredient("lait", 2);

    barista.addIngredient("café", 5);

    const success = barista.makeCoffee(coffee);

    expect(success).toBe(false);
    expect(barista.ingredients.find((i) => i.name === "café")?.quantity).toBe(
      5,
    );
  });

  // cas limite

  // Le lait est en stock mais en quantité insuffisante (1 au lieu des 2 requis)
  it("ne peut pas préparer un café lorsque la quantité est insuffisante", () => {
    const barista = new Barista("Fanny");
    const coffee = new Coffee("Cappuccino", 4);
    coffee.addIngredient("café", 1);
    coffee.addIngredient("lait", 2);

    barista.addIngredient("café", 5);
    barista.addIngredient("lait", 1);

    expect(barista.canMakeCoffee(coffee)).toBe(false);
  });
});
