// AI service for predictions and recommendations
export class AIService {
  static async getCashFlowPrediction(transactions, profile) {
    try {
      const prompt = this.buildPredictionPrompt(transactions, profile);
      
      const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'fw_3ZZhzvyBa679w9yuDhvA63bw' // Replace with actual API key
        },
        body: JSON.stringify({
          model: 'accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const data = await response.json();
      return this.parsePredictionResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI prediction error:', error);
      return this.getFallbackPrediction(transactions);
    }
  }

  static buildPredictionPrompt(transactions, profile) {
    const recentTransactions = transactions.slice(-10);
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Get smart watch categories
    const watchCategories = this.getWatchCategories(transactions);

    return `As a financial advisor, analyze this data and provide cash flow predictions:
    
User Profile:
- Monthly Income Goal: ${profile.monthlyIncomeGoal}
- Monthly Expense Limit: ${profile.monthlyExpenseLimit}
- Currency: ${profile.currency}

Recent Financial Data:
- Total Income: ${totalIncome}
- Total Expenses: ${totalExpenses}
- Net Balance: ${totalIncome - totalExpenses}

Recent Transactions: ${JSON.stringify(recentTransactions)}

Please provide:
1. Cash flow prediction for next 30 days (single number)
2. Use these spending categories to watch: ${JSON.stringify(watchCategories)}
3. One actionable budget recommendation

Format response as JSON:
{
  "prediction": number,
  "watchCategories": ${JSON.stringify(watchCategories)},
  "recommendation": "string"
}`;
  }

  static getWatchCategories(transactions) {
    // Filter to expenses only
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    if (expenseTransactions.length === 0) {
      return ["None. You're managing your expenses well!"];
    }

    // Group by category
    const categoryData = {};
    
    expenseTransactions.forEach(transaction => {
      const category = transaction.category;
      if (!categoryData[category]) {
        categoryData[category] = {
          total: 0,
          count: 0
        };
      }
      categoryData[category].total += transaction.amount;
      categoryData[category].count += 1;
    });

    // Calculate total expenses for percentage calculations
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Define smart thresholds
    const categoryThresholds = {
      // High-threshold categories (25-30%)
      'Housing': 0.30,
      'Insurance': 0.30,
      'Healthcare': 0.30,
      'Education': 0.30,
      
      // Normal-threshold categories (15-20%)
      'Food': 0.20,
      'Transportation': 0.20,
      'Utilities': 0.20,
      
      // Always-flag categories (10-15%)
      'Entertainment': 0.15,
      'Shopping': 0.15,
      'Other Expense': 0.15
    };

    // Find categories that meet criteria
    const watchCategories = [];
    
    Object.entries(categoryData).forEach(([category, data]) => {
      const percentage = data.total / totalExpenses;
      const threshold = categoryThresholds[category] || 0.20; // Default to 20%
      
      // Must have at least 2 transactions and meet percentage threshold
      if (data.count >= 2 && percentage >= threshold) {
        watchCategories.push({
          category,
          total: data.total,
          percentage
        });
      }
    });

    // Sort by total amount and return top 3 category names
    const sortedCategories = watchCategories
      .sort((a, b) => b.total - a.total)
      .slice(0, 3)
      .map(item => item.category);

    // If no categories meet the criteria, return positive message
    if (sortedCategories.length === 0) {
      return ["You're managing your expenses well!"];
    }

    return sortedCategories;
  }

  static parsePredictionResponse(response) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
    }
    
    return this.getFallbackPrediction();
  }

  static getFallbackPrediction(transactions = []) {
    const recentIncome = transactions
      .filter(t => t.type === 'income')
      .slice(-5)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const recentExpenses = transactions
      .filter(t => t.type === 'expense')
      .slice(-5)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      prediction: recentIncome - recentExpenses,
      watchCategories: this.getWatchCategories(transactions),
      recommendation: 'Track your spending more consistently to get better insights.'
    };
  }

  static async getBudgetRecommendations(transactions, profile) {
    const expensesByCategory = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    const recommendations = [];
    const sortedCategories = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a);

    if (sortedCategories.length > 0) {
      const [topCategory, topAmount] = sortedCategories[0];
      if (topAmount > profile.monthlyExpenseLimit * 0.3) {
        recommendations.push(`Consider reducing ${topCategory} expenses by 10-15%`);
      }
    }

    const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
    if (totalExpenses > profile.monthlyExpenseLimit) {
      recommendations.push(`You're ${((totalExpenses / profile.monthlyExpenseLimit - 1) * 100).toFixed(1)}% over your monthly limit`);
    }

    if (recommendations.length === 0) {
      recommendations.push('Great job staying within your budget!');
    }

    return recommendations;
  }
}