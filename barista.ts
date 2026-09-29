export class Coffee {
  // Nom du café, par exemple « Cappuccino ».
  name: string;
  // Liste des ingrédients nécessaires à la préparation du café.
  ingredients: { name: string; quantity: number }[];
  // Prix du café.
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.ingredients = [];
    this.price = price;
  }

  addIngredient(name: string, quantity: number): void {
    // Ajoute un ingrédient avec la quantité nécessaire pour une préparation.
    this.ingredients.push({
      name,
      quantity,
    });
  }
}

export class Ingredient {
  // Nom de l'ingrédient disponible dans le stock.
  name: string;
  // Quantité actuellement disponible.
  quantity: number;

  constructor(name: string, quantity: number) {
    this.name = name;
    this.quantity = quantity;
  }

  addQuantity(quantity: number): void {
    // Réapprovisionne le stock avec une nouvelle quantité.
    this.quantity += quantity;
  }

  removeQuantity(quantity: number): boolean {
    // Refuse le retrait si le stock est insuffisant.
    if (quantity > this.quantity) {
      return false;
    }

    // Retire la quantité utilisée et indique que l'opération a réussi.
    this.quantity -= quantity;
    return true;
  }
}

export class Barista {
  // Nom du barista.
  name: string;
  // Cafés que le barista sait préparer et vendre.
  coffees: Coffee[];
  // Ingrédients actuellement disponibles en stock.
  ingredients: Ingredient[];

  constructor(name: string) {
    this.name = name;
    this.coffees = [];
    this.ingredients = [];
  }

  addCoffee(coffee: Coffee): void {
    // Ajoute une recette à la liste des cafés disponibles.
    this.coffees.push(coffee);
  }

  getCoffee(name: string): Coffee | undefined {
    // Recherche un café par son nom ; undefined est renvoyé s'il est absent.
    return this.coffees.find(coffee => coffee.name === name);
  }

  listCoffees(): Coffee[] {
    // Retourne toutes les recettes enregistrées.
    return this.coffees;
  }

  addIngredient(name: string, quantity: number): void {
    // Cherche d'abord si l'ingrédient existe déjà dans le stock.
    const ingredient = this.ingredients.find(
      ingredient => ingredient.name === name
    );

    if (ingredient) {
      // Si l'ingrédient existe, on augmente sa quantité au lieu d'en créer un autre.
      ingredient.addQuantity(quantity);
      return;
    }

    // Sinon, on crée une nouvelle réserve d'ingrédient.
    this.ingredients.push(new Ingredient(name, quantity));
  }

  canMakeCoffee(coffee: Coffee): boolean {
    // Vérifie que chaque ingrédient requis est présent en quantité suffisante.
    return coffee.ingredients.every(requiredIngredient => {
      const ingredient = this.ingredients.find(
        ingredient => ingredient.name === requiredIngredient.name
      );

      return (
        ingredient !== undefined &&
        ingredient.quantity >= requiredIngredient.quantity
      );
    });
  }

  makeCoffee(coffee: Coffee): boolean {
    // On ne consomme rien si la recette ne peut pas être préparée entièrement.
    if (!this.canMakeCoffee(coffee)) {
      return false;
    }

    // Retire du stock les quantités utilisées par la recette.
    coffee.ingredients.forEach(requiredIngredient => {
      const ingredient = this.ingredients.find(
        ingredient => ingredient.name === requiredIngredient.name
      );

      ingredient?.removeQuantity(requiredIngredient.quantity);
    });

    return true;
  }

  orderCoffee(name: string): number | null {
    // Recherche le café demandé.
    const coffee = this.getCoffee(name);

    // Retourne null si le café n'existe pas.
    if (!coffee) {
      return null;
    }

    // Retourne également null si les ingrédients sont insuffisants.
    if (!this.makeCoffee(coffee)) {
      return null;
    }

    // La commande est réussie : le stock a été consommé et le prix est retourné.
    return coffee.price;
  }
}

// Création d'une recette de cappuccino et définition de ses ingrédients.
const cappuccino = new Coffee("Cappuccino", 3.5);

cappuccino.addIngredient("café", 1);
cappuccino.addIngredient("lait", 2);

const barista = new Barista("Alice");

// Ajout de la recette à la carte du barista.
barista.addCoffee(cappuccino);

// Remplissage du stock disponible.
barista.addIngredient("café", 5);
barista.addIngredient("lait", 10);

// Affiche la carte, la possibilité de préparer le cappuccino,
// le prix de la commande, puis le stock restant.
// console.log(barista.listCoffees());

// console.log(barista.canMakeCoffee(cappuccino));

// console.log(barista.orderCoffee("Cappuccino"));

// console.log(barista.ingredients);
