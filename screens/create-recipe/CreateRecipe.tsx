import React, { useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { StackActions } from '@react-navigation/native';

import { Ingredient, Recipe, RecipeScreen, StackParamList } from '../types';
import { CustomSafeAreaView } from '../CustomSafeAreaView';
import { saveRecipe } from '../../firebase/recipeDBHelper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type CreateRecipeProps = NativeStackScreenProps<
  StackParamList,
  RecipeScreen.Create
>;

type IngredientItemProps = {
  ingredient: Ingredient;
  remove: () => void;
};

type AddIngredientItem = {
  addItem: (ingredient: Ingredient) => void;
};

const IngredientItem = (props: IngredientItemProps) => (
  <View style={ingredientListItemStyles.parent}>
    <View style={ingredientListItemStyles.textContrainer}>
      <Text style={ingredientListItemStyles.ingredientText}>
        {props.ingredient.name}
      </Text>
      <Text style={ingredientListItemStyles.measurementText}>
        - {props.ingredient.measurement}
      </Text>
    </View>
    <TouchableOpacity
      style={ingredientListItemStyles.deleteButton}
      onPress={() => props.remove()}>
      <Text style={ingredientListItemStyles.deleteButtonText}>X</Text>
    </TouchableOpacity>
  </View>
);

const AddIngredientItem = (props: AddIngredientItem) => {
  const {
    control,
    getValues,
    formState: { isValid },
    reset,
  } = useForm<Ingredient>();
  return (
    <View style={addIngredientListItemStyles.parent}>
      <Text style={styles.inputLabel}>Ingredients</Text>
      <View style={addIngredientListItemStyles.inputParent}>
        <View style={addIngredientListItemStyles.inputContainer}>
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.textInput,
                  addIngredientListItemStyles.inputFieldName,
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Flour"
              />
            )}
          />
          <Controller
            name="measurement"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.textInput,
                  addIngredientListItemStyles.inputFieldMeasurement,
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="50g"
              />
            )}
          />
        </View>
        <TouchableOpacity
          style={addIngredientListItemStyles.addButton}
          onPress={() => {
            const values = getValues();
            if (!isValid) {
              return;
            }
            props.addItem(values);
            reset();
          }}>
          <Text style={addIngredientListItemStyles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const CreateRecipe = (props: CreateRecipeProps) => {
  const editableRecipe = props.route.params?.recipe;
  if (editableRecipe) {
    props.navigation.setOptions({ headerTitle: 'Edit your recipe' });
  }
  const {
    control,
    getValues,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      recipeName: editableRecipe ? editableRecipe.name : '',
    },
  });
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    editableRecipe ? editableRecipe.ingredients : [],
  );
  const [image, setImage] = useState<string | undefined>(
    editableRecipe && editableRecipe.imageUrl
      ? editableRecipe.imageUrl
      : undefined,
  );

  const submitButtonTitle = editableRecipe ? 'Update Recipe' : 'Add Recipe';

  const getImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submit = async () => {
    const values = getValues();
    if (!isValid) {
      return;
    }
    const recipe: Recipe = {
      name: values.recipeName,
      imageUrl: image,
      ingredients: ingredients,
    };
    if (editableRecipe) {
      recipe.id = editableRecipe.id;
    }
    const result = await saveRecipe(recipe);
    if (result.success) {
      Alert.alert('Success', result.message);
      props.navigation.dispatch(StackActions.popToTop());
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.parent}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Name</Text>
          <Controller
            name="recipeName"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.textInput}
              />
            )}
          />
        </View>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Recipe photo</Text>
          <View style={styles.pictureContainer}>
            {image ? (
              <Image style={styles.picture} source={{ uri: image }} />
            ) : (
              <View style={[styles.picture, styles.pictureEmpty]}>
                <Text style={styles.pictureText}>No image yet</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.addPictureButton}
              onPress={() => getImage()}>
              <Text style={styles.addPictureText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          style={styles.ingredientList}
          ListHeaderComponent={
            <AddIngredientItem
              addItem={ingredient => {
                setIngredients([...ingredients, ingredient]);
              }}
            />
          }
          stickyHeaderIndices={[0]}
          data={ingredients}
          renderItem={({ item, index }) => (
            <IngredientItem
              ingredient={item}
              remove={() => {
                setIngredients(list => {
                  list.splice(index, 1);
                  return [...list];
                });
              }}
            />
          )}
          ListEmptyComponent={
            <View style={ingredientListItemStyles.listEmptyParent}>
              <Text style={ingredientListItemStyles.listEmptyText}>
                You haven't entered any ingredients yet
              </Text>
            </View>
          }
        />
        <View>
          <Button title={submitButtonTitle} onPress={() => submit()} />
          <Button title="Cancel" onPress={() => props.navigation.goBack()} />
        </View>
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    height: '100%',
  },
  inputSection: {
    marginBottom: 12,
  },
  inputLabel: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
  pictureContainer: {
    position: 'relative',
    marginHorizontal: 'auto',
    alignSelf: 'center',
    width: 200,
    height: 200,
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
  addPictureButton: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    padding: 5,
    backgroundColor: 'blue',
    borderRadius: 8,
  },
  addPictureText: {
    textAlign: 'center',
    color: 'white',
  },
  ingredientList: {
    flex: 1,
  },
  ingredientField: {
    backgroundColor: 'white',
  },
});

const ingredientListItemStyles = StyleSheet.create({
  listEmptyParent: {
    width: '100%',
    minHeight: 100,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
  },
  listEmptyText: {
    textAlign: 'center',
  },
  parent: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 5,
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  textContrainer: {
    height: '100%',
    flexDirection: 'row',
    alignContent: 'center',
    gap: 10,
  },
  ingredientText: {
    fontWeight: '500',
  },
  measurementText: {
    fontWeight: '400',
    verticalAlign: 'middle',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    backgroundColor: 'red',
    borderCurve: 'circular',
    borderRadius: 50,
    fontSize: 40,
    padding: 8,
  },
  deleteButtonText: {
    color: 'white',
  },
});

const addIngredientListItemStyles = StyleSheet.create({
  parent: {
    width: '100%',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  inputParent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  inputFieldName: {
    width: 150,
  },
  inputFieldMeasurement: {
    width: 100,
  },
  addButton: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 10,
  },
  addButtonText: {
    color: 'white',
  },
});
