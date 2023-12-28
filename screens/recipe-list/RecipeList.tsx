import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import { Recipe, RecipeScreen, StackParamList } from '../types';
import { CustomSafeAreaView } from '../CustomSafeAreaView';
import { RecipeItem } from './RecipeItem';
import { getRecipes } from '../../firebase/recipeDBHelper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RecipeListProps = NativeStackScreenProps<
  StackParamList,
  RecipeScreen.List
>;

type AddButtonProps = {
  action: () => void;
};

const AddButton = (props: AddButtonProps) => (
  <TouchableOpacity onPress={() => props.action()} style={styles.addButton}>
    <Text style={styles.addButtonText}>+</Text>
  </TouchableOpacity>
);

export const RecipeList = (props: RecipeListProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const fetchRecipes = () => {
    getRecipes(data => {
      setRecipes(data);
    });
  };
  useEffect(() => {
    fetchRecipes();
  }, []);
  const loadCreateScreen = () => {
    props.navigation.navigate(RecipeScreen.Create, {});
  };
  const loadShowScreen = (recipe: Recipe) => {
    props.navigation.navigate(RecipeScreen.Show, {
      recipe: recipe,
    });
  };
  return (
    <CustomSafeAreaView>
      <View style={styles.parent}>
        <FlatList
          style={styles.recipeList}
          data={recipes}
          renderItem={({ item }) => (
            <RecipeItem
              recipe={item}
              action={() => {
                loadShowScreen(item);
              }}
            />
          )}
          ListEmptyComponent={
            <View style={styles.recipeEmptyContainer}>
              <Text style={styles.recipeEmptyText}>
                There are no recipes yet
              </Text>
            </View>
          }
        />
        <AddButton action={loadCreateScreen} />
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    width: '100%',
  },
  recipeList: {
    height: '100%',
    width: '100%',
  },
  recipeEmptyContainer: {
    height: '100%',
    minHeight: 400,
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  recipeEmptyText: {
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    zIndex: 10,
    height: 60,
    width: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    borderCurve: 'circular',
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
  },
});
