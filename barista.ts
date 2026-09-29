export class Coffee {
  name: string;
  ingredients: { name: string; quantity: number }[];
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.ingredients = [];
    this.price = price;
  }

  addIngredient(name: string, quantity: number): void {
    this.ingredients.push({
      name,
      quantity,
    });
  }
}

export class Ingredient {
  name: string;
  quantity: number;

  constructor(name: string, quantity: number) {
    this.name = name;
    this.quantity = quantity;
  }

  addQuantity(quantity: number): void {
    this.quantity += quantity;
  }

  removeQuantity(quantity: number): boolean {
    if (quantity > this.quantity) {
      return false;
    }

    this.quantity -= quantity;
    return true;
  }
}

export class Barista {
  name: string;
  coffees: Coffee[];
  ingredients: Ingredient[];

  constructor(name: string) {
    this.name = name;
    this.coffees = [];
    this.ingredients = [];
  }

  addCoffee(coffee: Coffee): void {
    this.coffees.push(coffee);
  }

  getCoffee(name: string): Coffee | undefined {
    return this.coffees.find(coffee => coffee.name === name);
  }

  listCoffees(): Coffee[] {
    return this.coffees;
  }

  addIngredient(name: string, quantity: number): void {
    const ingredient = this.ingredients.find(
      ingredient => ingredient.name === name
    );

    if (ingredient) {
      ingredient.addQuantity(quantity);
      return;
    }

    this.ingredients.push(new Ingredient(name, quantity));
  }

  canMakeCoffee(coffee: Coffee): boolean {
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
    if (!this.canMakeCoffee(coffee)) {
      return false;
    }

    coffee.ingredients.forEach(requiredIngredient => {
      const ingredient = this.ingredients.find(
        ingredient => ingredient.name === requiredIngredient.name
      );

      ingredient?.removeQuantity(requiredIngredient.quantity);
    });

    return true;
  }

  orderCoffee(name: string): number | null {
    const coffee = this.getCoffee(name);

    if (!coffee) {
      return null;
    }

    if (!this.makeCoffee(coffee)) {
      return null;
    }

    return coffee.price;
  }
}

const cappuccino = new Coffee("Cappuccino", 3.5);

cappuccino.addIngredient("café", 1);
cappuccino.addIngredient("lait", 2);

const barista = new Barista("Alice");

barista.addCoffee(cappuccino);

barista.addIngredient("café", 5);
barista.addIngredient("lait", 10);

console.log(barista.listCoffees());

console.log(barista.canMakeCoffee(cappuccino));

console.log(barista.orderCoffee("Cappuccino"));

console.log(barista.ingredients);
