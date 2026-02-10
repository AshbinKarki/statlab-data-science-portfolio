# StatLab: Data Science Portfolio Dashboard 📊


## 📖 Overview

**StatLab** is an interactive web application designed to demonstrate core **Data Science** and **Statistical Analysis** competencies. 

Unlike static notebooks, this project features a **dynamic synthetic data generator** that creates realistic employee datasets on the fly using statistical probability distributions. It enables users to perform real-time hypothesis testing, regression analysis, and receive automated insights via Google Gemini AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🔬 Statistical Methods Implemented

This project showcases the practical application of the following statistical concepts, essential for any Data Scientist role:

### 1. Data Generation (Probability Distributions)
- **Normal Distribution (Gaussian)**: Implemented the **Box-Muller Transform** to generate realistic distributions for `Age` and `Performance Scores`.
- **Skewed Distributions**: Modeled `Years of Experience` to reflect real-world seniority hierarchies.
- **Probabilistic Modeling**: Used conditional probability logic to model `Churn` based on Salary, Overwork, and Performance factors.

### 2. Inferential Statistics (Hypothesis Testing)
- **Independent Samples T-Test**: Compares means between two independent groups (e.g., Engineering vs. Sales salaries).
- **Significance Testing**: Calculates **T-Statistic** and **P-Value** to accept or reject null hypotheses.

### 3. Regression Analysis
- **Simple Linear Regression**: Implements the Least Squares method from scratch (`y = mx + c`) to model relationships.
- **Correlation**: Calculates **Pearson Correlation Coefficient (r)** and **Coefficient of Determination (R²)** to measure relationship strength.

### 4. Descriptive Statistics
- **Central Tendency**: Mean, Median.
- **Dispersion**: Standard Deviation, Variance, Range.
- **Skewness**: Measures the asymmetry of the probability distribution.

## ✨ Key Features

- **Synthetic Dataset Generator**: Instantly generate N=200+ records of employee data with realistic noise and correlations.
- **Interactive Dashboard**:
  - **Overview**: Key KPIs (Churn Rate, Avg Salary) and raw data view.
  - **Hypothesis Lab**: Interactive T-Test tool with visualization.
  - **Regression Lab**: Scatter plots with dynamic trend lines and fit metrics.
- **AI Analyst Integration**: 
  - Uses **Google Gemini API** to generate plain-English "Data Scientist" interpretations of statistical results.
- **CSV Export**: Download the generated dataset for further analysis in Python/R.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Visualization**: Recharts
- **AI/LLM**: Google GenAI SDK
- **Icons**: Lucide React

## 🚀 Getting Started

To run this project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/statlab-data-science-portfolio.git
   cd statlab-data-science-portfolio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment**
   - Create a `.env` file in the root directory.
   - Add your Gemini API Key (Required for AI features):
     ```bash
     VITE_API_KEY=your_google_gemini_api_key
     ```
   *Note: If you don't have a key, the statistical features will still work, but AI insights will be disabled.*

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```
/src
  ├── services/
  │   ├── statsService.ts   # Core statistical algorithms (T-Test, Regression, StdDev)
  │   ├── dataService.ts    # Synthetic data generation logic
  │   └── geminiService.ts  # AI integration
  ├── components/           # Reusable UI components
  ├── types.ts              # TypeScript definitions
  └── App.tsx               # Main application logic
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Created to demonstrate full-stack data science capabilities.*
