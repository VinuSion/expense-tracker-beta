import { useEffect, useRef } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { Category, TransactionType } from '@/utils/types'

interface CategoriesListProps {
  transactionType: TransactionType
  categories: Category[]
  currentCategorySelected: number | null
  style?: object;
  setCurrentCategorySelected: (id: number | null) => void
}

export default function CategoriesList({ transactionType, categories, currentCategorySelected, style, setCurrentCategorySelected }: CategoriesListProps) {
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
    }
  }, [transactionType])

  return (
    <View style={[styles.categorySection, style]}>
      <FlatList
        ref={flatListRef}
        data={categories}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              currentCategorySelected === item.id && styles.categoryItemSelected,
            ]}
            onPress={() => setCurrentCategorySelected(item.id)}
          >
            <Text style={styles.categoryName}>{item.category_name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  categorySection: {
    height: 40,
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 25,
    backgroundColor: '#313f47',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryItemSelected: {
    borderColor: '#00c4c1',
    backgroundColor: '#436a7f',
  },
  categoryName: {
    color: '#fff',
  },
})