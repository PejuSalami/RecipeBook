export enum RecipeScreen {
  List = 'List',
  Create = 'Create',
  Show = 'Show',
}

export type StackParamList = {
  [RecipeScreen.List]: undefined;
  [RecipeScreen.Create]: { recipe?: Recipe };
  [RecipeScreen.Show]: { recipe: Recipe };
};

export type Ingredient = {
  name: string;
  measurement: string;
};

export type Recipe = {
  id?: string;
  name: string;
  imageUrl?: string;
  ingredients: Ingredient[];
};
