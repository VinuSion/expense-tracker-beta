import { useCallback } from 'react'
import { Alert } from 'react-native'
import { useSQLiteContext } from 'expo-sqlite'
import { useFetchTransactions } from './useFetchTransactions'
import { useFilterStore } from '@/store/filterStore'

export const useDeleteTransaction = () => {
  const db = useSQLiteContext()
  const { fetchCurrentTransactions } = useFetchTransactions()
  const { resetFilters } = useFilterStore()

  const deleteTransaction = useCallback(
    async (id: number) => {
      try {
        const deleteQuery = `
        DELETE FROM transactions
        WHERE id = ?
        `
        const deleteResult = await db.runAsync(deleteQuery, [id])

        console.log('Delete Transaction Result', deleteResult)
        resetFilters()
        await fetchCurrentTransactions()

        Alert.alert('Success', 'Transaction deleted successfully')
      } catch (error) {
        console.error('Failed to delete transaction:', error)
        Alert.alert('Error', 'Failed to delete transaction')
      }
    },
    [db]
  )

  return { deleteTransaction }
}