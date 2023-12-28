import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Recipe } from '../types';

export type RecipeItemProps = {
  recipe: Recipe;
  action: () => void;
};

export const RecipeItem = (props: RecipeItemProps) => {
  return (
    <TouchableOpacity style={styles.touchable} onPress={() => props.action()}>
      <View style={styles.parent}>
        {props.recipe.imageUrl && (
          <Image style={styles.image} source={{ uri: props.recipe.imageUrl }} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{props.recipe.name}</Text>
          <Text>{props.recipe.ingredients.length} ingredients</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
  parent: {
    width: '100%',
    padding: 8,
    flexDirection: 'row',
    gap: 10,
    alignContent: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  textContainer: {
    flexDirection: 'column',
    gap: 5,
  },
  nameText: {
    fontWeight: 'bold',
  },
});
