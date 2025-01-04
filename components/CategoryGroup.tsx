import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GroupedTransactionsByCategory, TransformedTransaction } from '@/utils/types';
import { formatAmount, getCategoryIcon } from '@/utils/helpers';
import TransactionCard from './TransactionCard';

interface CategoryGroupProps {
  item: GroupedTransactionsByCategory;
  activeCardId: number | null;
  setActiveCardId: (id: number | null) => void;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({ item, activeCardId, setActiveCardId }) => {
  return (
    <View style={styles.categoryGroupContainer}>
      <Pressable style={styles.categoryHeader} onPress={() => setActiveCardId(null)}>
        <View style={styles.headerLeft}>
          <MaterialIcons name={getCategoryIcon(item.category_name)} size={24} color="#fff" />
          <Text style={styles.categoryName}>{item.category_name}</Text>
        </View>
        <View style={styles.categoryAmounts}>
          {item.category_type === "Expense" ? (
            <>
              <Text style={[styles.expenseAmount, { fontWeight: 900 }]}>Expense</Text>
              <Text style={styles.expenseAmount}>-${formatAmount(item.expenseAmount ?? 0)}</Text>
            </>
          ) : (
            <>
              <Text style={[styles.incomeAmount, { fontWeight: 900 }]}>Income</Text>
              <Text style={styles.incomeAmount}>+${formatAmount(item.incomeAmount ?? 0)}</Text>
            </>
          )}
        </View>
      </Pressable>
      {item.transactions.map((transaction: TransformedTransaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          isActive={transaction.id === activeCardId}
          showBank
          setActiveCardId={setActiveCardId}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryGroupContainer: {
    gap: 5,
    borderRadius: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#1b2026',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#45576d',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '900',
  },
  categoryAmounts: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  incomeAmount: {
    color: '#2bc444',
  },
  expenseAmount: {
    color: '#e82e44',
  },
});

export default CategoryGroup;