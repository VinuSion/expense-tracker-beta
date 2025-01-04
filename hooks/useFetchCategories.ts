import { useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import { useDBStore } from '@/store/dbStore'
import { Category, TransactionType } from '@/utils/types'

export function useFetchCategories(categoryType: TransactionType = 'Expense') {
  const { dbExists } = useDBStore()
  const db = useSQLiteContext()
  const [categories, setCategories] = useState<Category[]>([])

  async function fetchCategories() {
    try {
      const result = await db.getAllAsync<Category>(
        `SELECT * FROM categories WHERE category_type = ?;`,
        [categoryType]
      )
      console.log('Categories Data:', result)
      setCategories(result)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    if (db && dbExists) {
      console.log('Fetching categories...')
      db.withTransactionAsync(async () => {
        await fetchCategories()
      })
    }
  }, [db, dbExists, categoryType])

  return categories
}