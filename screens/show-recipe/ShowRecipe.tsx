import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { RecipeScreen, StackParamList } from '../types';
import { CustomSafeAreaView } from '../CustomSafeAreaView';

export type ShowRecipeProp = NativeStackScreenProps<
  StackParamList,
  RecipeScreen.Show
>;

export const ShowRecipe = (props: ShowRecipeProp) => {
  const recipe = props.route.params.recipe;
  const loadCreateScreen = () => {
    props.navigation.navigate(RecipeScreen.Create, {
      recipe: props.route.params.recipe,
    });
  };
  return (
    <CustomSafeAreaView>
      <View style={styles.parent}>
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => loadCreateScreen()}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.pictureContainer}>
          {recipe.imageUrl ? (
            <Image style={styles.picture} source={{ uri: recipe.imageUrl }} />
          ) : (
            <View style={[styles.picture, styles.pictureEmpty]}>
              <Text style={styles.pictureText}>No image yet</Text>
            </View>
          )}
        </View>
        <FlatList
          style={styles.ingredientList}
          ListHeaderComponent={
            <Text style={styles.sectionHead}>Ingredients</Text>
          }
          data={recipe.ingredients}
          renderItem={({ item }) => (
            <View style={styles.ingredientContrainer}>
              <Text style={styles.ingredientName}>{item.name}</Text>
              <Text> - {item.measurement}</Text>
            </View>
          )}
        />
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    width: '100%',
    height: '100%',
    padding: 8,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignContent: 'center',
    gap: 10,
    marginBottom: 12,
  },
  recipeName: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  editButton: {
    justifyContent: 'center',
    alignContent: 'center',
    padding: 5,
  },
  editButtonText: {
    color: 'blue',
  },
  sectionHead: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pictureContainer: {
    position: 'relative',
    marginHorizontal: 'auto',
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  picture: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
  },
  pictureEmpty: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  pictureText: {
    textAlign: 'center',
  },
  ingredientList: {
    width: '100%',
    height: '100%',
  },
  ingredientContrainer: {
    flexDirection: 'row',
    alignContent: 'center',
    padding: 8,
  },
  ingredientName: {
    fontWeight: 'bold',
  },
  emptyParent: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});
