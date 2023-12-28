// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCsNNoNpzQeqwz-jITsbAd3oHR6tFMGJkg',
  authDomain: 'recipeapp-b7228.firebaseapp.com',
  databaseURL:
    'https://recipeapp-b7228-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'recipeapp-b7228',
  storageBucket: 'recipeapp-b7228.appspot.com',
  messagingSenderId: '30942804174',
  appId: '1:30942804174:web:1e89ee848f6ddb2c44389f',
  measurementId: 'G-89Q0ZNEDQE',
};

export const DATABASE_URL = `https://${firebaseConfig.projectId}-default-rtdb.europe-west1.firebasedatabase.app`;

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const firebaseDatabase = getDatabase(firebaseApp, DATABASE_URL);

export const RECIPES_ROOT = 'recipes';
