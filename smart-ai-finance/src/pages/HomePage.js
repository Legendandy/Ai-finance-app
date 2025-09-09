import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Brain,
  ArrowRight,
  CheckCircle,
  Shield,
  Target,
  BarChart3,
  Zap,
  Clock,
  Users,
  Star,
  Calculator,
  PieChart,
  AlertCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const HomePage = () => {
  const navigate = useNavigate();
  const [userProfile] = useLocalStorage('userProfile', null);
  const [openFAQ, setOpenFAQ] = useState(null);

  const handleGetStarted = () => {
    if (userProfile) {
      // User has already completed onboarding, go to dashboard
      navigate('/dashboard');
    } else {
      // User hasn't completed onboarding, go to onboarding
      navigate('/onboarding');
    }
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const features = [
    {
      icon: DollarSign,
      title: 'Automated Budgeting',
      description: 'Set financial goals and track your progress with intelligent budget recommendations that adapt to your spending patterns and income changes.'
    },
    {
      icon: TrendingUp,
      title: 'Expense Tracking',
      description: 'Monitor your spending patterns across categories, identify areas for improvement, and get alerts when you exceed budget limits.'
    },
    {
      icon: FileText,
      title: 'Smart Invoicing',
      description: 'Create professional invoices with automated tax calculations, payment tracking, and client management features.'
    },
    {
      icon: Brain,
      title: 'AI Cash Flow Predictions',
      description: 'Get intelligent forecasts based on your financial history, seasonal trends, and personalized spending patterns.'
    }
  ];

  const detailedFeatures = [
    {
      icon: Calculator,
      title: 'Advanced Budget Calculator',
      description: 'Our AI analyzes your income, fixed expenses, and spending habits to create personalized budget recommendations. Track multiple budget categories, set savings goals, and receive notifications when you\'re approaching limits.',
      highlights: ['50/30/20 rule optimization', 'Custom category creation', 'Goal-based budgeting', 'Emergency fund calculator'],
      image: 'budget.png'
    },
    {
      icon: PieChart,
      title: 'Visual Financial Analytics',
      description: 'Transform your financial data into easy-to-understand charts and graphs. Identify spending trends, track progress toward goals, and make data-driven financial decisions with comprehensive reporting.',
      highlights: ['Interactive dashboards', 'Monthly/yearly comparisons', 'Category breakdowns', 'Trend analysis'],
      image: 'visual.png'
    },
    {
      icon: Lightbulb,
      title: 'Smart Financial Recommendations',
      description: 'Receive personalized advice based on your financial situation. Our AI identifies opportunities to save money, optimize spending, and improve your overall financial health.',
      highlights: ['Subscription optimization', 'Bill negotiation tips', 'Investment suggestions', 'Tax optimization'],
      image: 'smart.png'
    },
    {
      icon: Shield,
      title: 'Privacy-First Architecture',
      description: 'Your financial data never leaves your device. All calculations and AI processing happen securely on our backend. We never save or store your data, ensuring complete privacy without compromising functionality',
      highlights: ['Local data storage', 'No server uploads', 'Encrypted backups', 'GDPR compliant'],
      image: 'privary.png'
    }
  ];

  const benefits = [
    'No bank account connection required - complete privacy',
    'Complete data ownership - information stored locally on your device',
    'AI-powered financial insights and predictions',
    'Professional invoice generation with tax calculations',
    'Real-time budget tracking with smart notifications',
    'Cash flow predictions up to 12 months ahead',
    'Multi-currency support for global users',
    'Offline functionality - works without internet',
    'Export capabilities for tax preparation',
    'Customizable categories and tags for better organization'
  ];

  const useCases = [
    {
      icon: Users,
      title: 'Freelancers & Consultants',
      description: 'Perfect for managing irregular income, tracking project expenses, creating professional invoices, and planning for tax season. Handle multiple clients and projects with ease.',
      features: ['Project-based budgeting', 'Invoice templates', 'Tax estimation', 'Client payment tracking']
    },
    {
      icon: Target,
      title: 'Small Business Owners',
      description: 'Streamline your business finances with comprehensive expense tracking, cash flow management, and financial planning tools designed for growing businesses.',
      features: ['Business expense categories', 'Profit/loss tracking', 'Vendor management', 'Financial reporting']
    },
    {
      icon: BarChart3,
      title: 'Personal Finance Enthusiasts',
      description: 'Take control of your personal finances with detailed budgeting, savings goals, investment tracking, and long-term financial planning capabilities.',
      features: ['Savings goal tracking', 'Investment monitoring', 'Debt payoff planning', 'Retirement calculations']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Freelance Designer',
      quote: 'SpendBuddy transformed how I manage my irregular income. The AI predictions help me plan months ahead, and I love that my data stays completely private.',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Small Business Owner',
      quote: 'The invoicing feature alone is worth it. Professional templates, automatic tax calculations, and payment tracking - everything I need in one place.',
      rating: 4
    },
    {
      name: 'Emma Thompson',
      role: 'Financial Analyst',
      quote: 'Finally, a finance app that respects my privacy. The local storage approach is brilliant, and the AI insights are surprisingly accurate.',
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How does the AI work without accessing my bank accounts?",
      answer: "Our AI analyzes the financial data you input manually (income, expenses, goals) to provide personalized insights. All processing happens locally on your device using advanced machine learning algorithms. The AI learns from your patterns over time to make increasingly accurate predictions and recommendations."
    },
    {
      question: "Is my financial data really secure?",
      answer: "Absolutely. Your data never leaves your device - it's stored locally in your browser using encrypted storage. We don't have servers that store user data, so there's nothing for hackers to breach. You can even use the app completely offline once it's loaded."
    },
    {
      question: "How accurate are the cash flow predictions?",
      answer: "Our AI typically achieves 85-95% accuracy for monthly predictions and 70-80% for longer-term forecasts. Accuracy improves over time as the AI learns your specific patterns. The system accounts for seasonal variations, irregular income, and spending trends to provide realistic projections."
    },
    {
      question: "Can I export my data for tax purposes?",
      answer: "Yes! You can export all your data in multiple formats including CSV, PDF reports, and tax-ready summaries. The invoicing feature automatically calculates taxes and generates reports compatible with popular tax software."
    },
    {
      question: "What happens if I clear my browser data?",
      answer: "You can create encrypted backup files that you store safely (like in cloud storage or on a USB drive). These backups can restore all your data if needed. We also recommend regular exports of your financial data as an additional safety measure."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-blue-600">
              Spend Buddy Finance
            </div>
            <Button size="medium" onClick={handleGetStarted}>
              {userProfile ? 'Go to Dashboard' : 'Get Started'}
            </Button>
          </div>
        </div>
      </nav>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Spend Buddy Finance
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Take Control of Your Money with AI-Powered Budgeting, 
            Expense Tracking, and Cash Flow Predictions - All While Keeping Your Data 100% Private
          </p>
          
          <Button size="large" className="text-lg px-8 py-4" onClick={handleGetStarted}>
            {userProfile ? 'Go to Dashboard' : 'Get Started Free - No Registration Required'}
          </Button>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-gray-600">Privacy Protected</div>
              <div className="text-sm text-gray-500 mt-1">Data never leaves your device</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">AI</div>
              <div className="text-gray-600">Powered Insights</div>
              <div className="text-sm text-gray-500 mt-1">Intelligent predictions & recommendations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">$0</div>
              <div className="text-gray-600">Setup Fee</div>
              <div className="text-sm text-gray-500 mt-1">Start managing finances immediately</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Traditional Finance Apps Fall Short
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Most financial apps require you to connect your bank accounts, upload sensitive data to their servers, 
              and trust them with your most private information. They offer generic advice that doesn't fit your unique situation, 
              and often come with hidden fees or subscription traps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center border-red-200 bg-red-50">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy Concerns</h3>
              <p className="text-gray-600">
                Your financial data is uploaded to servers, potentially exposed to breaches, 
                and often sold to third parties for marketing purposes.
              </p>
            </Card>
            
            <Card className="text-center border-orange-200 bg-orange-50">
              <Clock size={48} className="text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Complex Setup</h3>
              <p className="text-gray-600">
                Hours of setup time connecting accounts, categorizing transactions, 
                and configuring settings before you can even start managing your money.
              </p>
            </Card>
            
            <Card className="text-center border-yellow-200 bg-yellow-50">
              <DollarSign size={48} className="text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hidden Costs</h3>
              <p className="text-gray-600">
                "Free" apps with premium features locked behind paywalls, 
                or expensive monthly subscriptions for basic functionality.
              </p>
            </Card>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-semibold text-blue-600 mb-4">
              There Has to Be a Better Way
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Spend Buddy was built from the ground up to solve these problems. Complete privacy, 
              instant setup, and powerful AI insights - all for free, with no compromises.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Master Your Finances
            </h2>
            <p className="text-xl text-gray-600">
              Powerful tools designed for freelancers, small businesses, and anyone serious about financial success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Dive Deeper Into What Makes Us Different
            </h2>
            <p className="text-xl text-gray-600">
              Each feature is thoughtfully designed to give you maximum control with minimum effort
            </p>
          </div>
          
          <div className="space-y-16">
            {detailedFeatures.map((feature, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <feature.icon size={24} className="text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">{feature.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {feature.highlights.map((highlight, hIndex) => (
                      <div key={hIndex} className="flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <Card className="p-2 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
                    <img 
                      src={`/${feature.image}`} 
                      alt={`${feature.title} Preview`}
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                      style={{ minHeight: '300px', maxHeight: '400px' }}
                    />
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Your Unique Financial Journey
            </h2>
            <p className="text-xl text-gray-600">
              Whether you're managing irregular income, growing a business, or optimizing personal finances
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="card-hover">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <useCase.icon size={32} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{useCase.title}</h3>
                <p className="text-gray-600 mb-6">{useCase.description}</p>
                <div className="space-y-3">
                  {useCase.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Spend Buddy?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Built with privacy and simplicity in mind. No complex setups, no bank connections required, 
                no monthly fees. Just smart financial management that works the way you do - privately, 
                efficiently, and intelligently.
              </p>
              
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle size={24} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h4 className="font-semibold text-blue-900 mb-2">🚀 Getting Started Takes Less Than 2 Minutes</h4>
                <p className="text-blue-800 text-sm">
                  No account creation, no email verification, no bank connections. 
                  Just open the app and start managing your finances immediately.
                </p>
              </div>
              
              <div className="mt-8">
                <Button size="large" onClick={handleGetStarted}>
                  {userProfile ? 'Go to Dashboard' : 'Start Your Financial Journey Now'}
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h4 className="text-lg font-semibold text-gray-900 mb-6 text-center">Live Financial Dashboard Preview</h4>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="text-green-800 font-medium">Monthly Income</span>
                  <span className="text-green-600 font-bold text-lg">$5,240</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <span className="text-red-800 font-medium">Monthly Expenses</span>
                  <span className="text-red-600 font-bold text-lg">$3,180</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="text-blue-800 font-medium">Available to Save</span>
                  <span className="text-blue-600 font-bold text-lg">$2,060</span>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Brain size={20} className="text-purple-600 mr-2" />
                    <span className="text-purple-800 font-medium">AI Financial Insight</span>
                  </div>
                  <p className="text-purple-700 text-sm mb-2">
                    Based on your spending patterns, you're on track to save $24,720 this year! 
                    Our AI suggests allocating 20% to a high-yield savings account and 10% to index funds.
                  </p>
                  <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded inline-block">
                    Prediction Confidence: 94%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Financial Professionals and Everyday Users
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about transforming their financial management
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Spend Buddy
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openFAQ === index ? (
                      <ChevronUp size={24} className="text-blue-600" />
                    ) : (
                      <ChevronDown size={24} className="text-gray-400" />
                    )}
                  </div>
                </button>
                
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openFAQ === index 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <p className="text-gray-600 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Financial Future?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of users who have transformed their relationship with money using Spend Buddy. 
            No commitments, no subscriptions, no compromises on privacy. Your financial success starts today.
          </p>
          <div className="mb-8">
            <Button 
              variant="secondary" 
              size="large" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
              onClick={handleGetStarted}
            >
              {userProfile ? 'Go to Dashboard' : 'Start Your Free Financial Transformation'}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-blue-100">
            <div>
              <div className="text-2xl font-bold mb-2">2 Minutes</div>
              <div>Setup Time Required</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">100% Private</div>
              <div>Data Stays On Your Device</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">AI Powered</div>
              <div>Intelligent Financial Insights</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="text-2xl font-bold mb-4">Spend Buddy Finance</div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>AI Budget Planning</li>
                <li>Expense Tracking</li>
                <li>Invoice Generation</li>
                <li>Cash Flow Predictions</li>
                <li>Financial Analytics</li>
                <li>Privacy Protection</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Use Cases</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Freelancers</li>
                <li>Small Businesses</li>
                <li>Personal Finance</li>
                <li>Consultants</li>
                <li>Finance Teams</li>
                <li>Students</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <div className="text-sm text-gray-500 mb-4">
              © 2025 Spend Buddy Finance. Your data stays private and secure. Always.
            </div>
            <div className="text-xs text-gray-600">
              No cookies, no tracking, no data collection. Built for privacy by design.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};