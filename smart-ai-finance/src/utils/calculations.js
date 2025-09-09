// Financial calculations utility
export const calculations = {
  getCurrentMonthTransactions: (transactions) => {
    if (!Array.isArray(transactions)) return [];
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions.filter(transaction => {
      if (!transaction || !transaction.date) return false;
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
  },

  getTotalByType: (transactions, type) => {
    if (!Array.isArray(transactions) || !type) return 0;
    
    return transactions
      .filter(transaction => transaction && transaction.type === type && typeof transaction.amount === 'number')
      .reduce((total, transaction) => total + transaction.amount, 0);
  },

  getTransactionsByCategory: (transactions) => {
    if (!Array.isArray(transactions)) return {};
    
    const categories = {};
    transactions.forEach(transaction => {
      if (!transaction || !transaction.category || typeof transaction.amount !== 'number') return;
      
      if (!categories[transaction.category]) {
        categories[transaction.category] = {
          income: 0,
          expense: 0,
          total: 0
        };
      }
      
      categories[transaction.category][transaction.type] += transaction.amount;
      categories[transaction.category].total += transaction.type === 'income' 
        ? transaction.amount 
        : -transaction.amount;
    });
    
    return categories;
  },

  getMonthlyData: (transactions, months = 6) => {
    if (!Array.isArray(transactions)) return [];
    
    const monthlyData = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthTransactions = transactions.filter(transaction => {
        if (!transaction || !transaction.date) return false;
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === month.getMonth() && 
               transactionDate.getFullYear() === month.getFullYear();
      });
      
      // Use calculations.getTotalByType instead of this.getTotalByType
      const income = calculations.getTotalByType(monthTransactions, 'income');
      const expenses = calculations.getTotalByType(monthTransactions, 'expense');
      
      monthlyData.push({
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income,
        expenses,
        net: income - expenses
      });
    }
    
    return monthlyData;
  },

  calculateProgress: (actual, target) => {
    if (typeof actual !== 'number' || typeof target !== 'number' || target === 0) return 0;
    return Math.min((actual / target) * 100, 100);
  }
};