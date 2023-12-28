import { onValue, push, ref as dbRef, update } from 'firebase/database';
import {
  getStorage,
  uploadBytes,
  ref as storageRef,
  getDownloadURL,
} from 'firebase/storage';

import { Recipe } from '../screens/types';
import { RECIPES_ROOT, firebaseApp, firebaseDatabase } from './firebase';

type RecipesDB = {
  [key: string]: Recipe;
};

export const getRecipes = (callback: (recipes: Recipe[]) => void) => {
  const ref = dbRef(firebaseDatabase, RECIPES_ROOT);
  onValue(ref, snapshot => {
    const data = snapshot.val() as RecipesDB | null;
    if (!data) {
      return callback([]);
    }
    const recipes = Object.entries(data).map(response => {
      if (!response[1].ingredients) {
        response[1].ingredients = [];
      }
      const recipe = response[1];
      recipe.id = response[0];
      return recipe;
    });
    callback(recipes);
  });
};

const uploadImage = async (imageUrl: string, title: string) => {
  const blob = (await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', imageUrl, true);
    xhr.send(null);
  })) as Blob;

  const convertTile = title.replaceAll(' ', '_').toLowerCase();
  const randomText = Math.random().toString(36).substring(3, 9);
  const imageTitle = convertTile + '_' + randomText;

  const fileRef = storageRef(
    getStorage(firebaseApp),
    RECIPES_ROOT + '/' + imageTitle,
  );
  await uploadBytes(fileRef, blob);
  // blob.close();

  return await getDownloadURL(fileRef);
};

export const saveRecipe = async (recipe: Recipe) => {
  let recipePath = RECIPES_ROOT;
  let editing = false;
  if (recipe.id) {
    recipePath = recipePath + '/' + recipe.id;
    editing = true;
    delete recipe.id;
  }
  const ref = dbRef(firebaseDatabase, recipePath);

  try {
    console.log('The image url - ', recipe.imageUrl);
    if (recipe.imageUrl && recipe.imageUrl.includes('file://')) {
      recipe.imageUrl = await uploadImage(recipe.imageUrl, recipe.name);
    }
    if (editing) {
      const result = await update(ref, recipe);
      console.log(result);
    } else {
      const result = await push(ref, recipe);
      console.log(result);
    }
    return { success: true, message: 'Recipe saved successfuly' };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'There was an error saving the recipe' };
  }
};
