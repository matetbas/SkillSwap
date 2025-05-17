import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { CATEGORIES, Categories } from '@/types';

interface CategoryPickerProps {
  selectedCategory: Categories | null;
  onSelectCategory: (category: Categories | null) => void;
}

export default function CategoryPicker({ 
  selectedCategory, 
  onSelectCategory 
}: CategoryPickerProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryItem,
            !selectedCategory && styles.selectedCategory,
          ]}
          onPress={() => onSelectCategory(null)}
        >
          <Text
            style={[
              styles.categoryText,
              !selectedCategory && styles.selectedCategoryText,
            ]}
          >
            Tous
          </Text>
        </TouchableOpacity>

        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryItem,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => onSelectCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: Colors.light.primary,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.light.secondary,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});