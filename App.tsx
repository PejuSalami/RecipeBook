/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RecipeList } from './screens/recipe-list/RecipeList';
import { RecipeScreen, StackParamList } from './screens/types';
import { CreateRecipe } from './screens/create-recipe/CreateRecipe';
import { ShowRecipe } from './screens/show-recipe/ShowRecipe';

// import {IntroScreen} from './IntroScreen';
const Stack = createNativeStackNavigator<StackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={RecipeScreen.List}
          component={RecipeList}
          options={{ title: 'Recipes' }}
        />
        <Stack.Screen
          name={RecipeScreen.Create}
          component={CreateRecipe}
          options={{ title: 'Create a new recipe' }}
        />
        <Stack.Screen
          name={RecipeScreen.Show}
          component={ShowRecipe}
          options={{ title: '' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
