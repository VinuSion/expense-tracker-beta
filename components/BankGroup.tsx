import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { GroupedTransactionsByBank, TransformedTransaction } from '@/utils/types';
import { formatAmount } from '@/utils/helpers';
import TransactionCard from './TransactionCard';

interface BankGroupProps {
  item: GroupedTransactionsByBank;
  activeCardId: number | null;
  setActiveCardId: (id: number | null) => void;
}

const BankGroup: React.FC<BankGroupProps> = ({ item, activeCardId, setActiveCardId }) => {
  return (
    <View style={styles.bankGroupContainer}>
      <Pressable style={styles.bankHeader} onPress={() => setActiveCardId(null)}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: item.logo_url }} style={styles.bankLogo} />
          <Text style={styles.bankName}>{item.bank_name}</Text>
        </View>
        <View style={styles.bankAmounts}>
          <Text style={styles.incomeAmount}>+${formatAmount(item.incomeAmount)}</Text>
          <Text style={styles.expenseAmount}>-${formatAmount(item.expenseAmount)}</Text>
        </View>
      </Pressable>
      {item.transactions.map((transaction: TransformedTransaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          isActive={transaction.id === activeCardId}
          showCategory
          setActiveCardId={setActiveCardId}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bankGroupContainer: {
    gap: 5,
    borderRadius: 10,
  },
  bankHeader: {
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
  bankLogo: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  bankName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 900,
  },
  bankAmounts: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  incomeAmount: {
    color: '#2bc444',
  },
  expenseAmount: {
    color: '#e82e44',
  },
});

export default BankGroup;