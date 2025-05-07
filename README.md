Market Vision Forecast

Market Vision Forecast is a full-stack web application that enables users to explore, analyze, and forecast stock data using database systems and machine learning. Built with modern frontend and backend technologies, this project offers a real-time dashboard to visualize and predict stock price trends.

🔗 Live Preview: Market Vision Forecast📁 Project URL: Lovable Project
https://preview--market-vision-forecast.lovable.app

📉 Features

✨ Stock Database Explorer – Browse, filter, and export historical stock data

📊 Visual Price History – Interactive chart for trend analysis

🤖 ML Model Training – Train a regression model on historic prices

🔢 Entity-Relationship Viewer – Inspect the DB schema and relationships

🌎 Web-based UI – Built with React, Tailwind CSS, and shadcn-ui components

🌐 Tech Stack

Frontend: Vite + React + TypeScript + Tailwind CSS + shadcn-ui

Backend: Python (Flask)

Database: SQLite (Local)

ML Models: scikit-learn (Linear Regression, Random Forest)

⚙️ Local Development

Clone & Install

git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i

Run Dev Server

npm run dev

🚀 Deployment

To deploy your app:

Go to your Lovable Project

Click Share > Publish to deploy changes.

Custom Domains

To link a domain:

Go to Project > Settings > Domains

Click Connect Domain and follow the instructions

🔍 Explore the Database

ER Diagram

Stock(symbol, name, sector, industry, ceo, founded_year)

PriceHistory(id, stock_symbol, date, open, high, low, close, volume)

Model(id, name, algorithm, created_at, parameters, accuracy)

Prediction(id, stock_symbol, date, predicted_price, model_id, accuracy)

Relationships

Stock 1-N PriceHistory

Stock 1-N Prediction

Model 1-N Prediction

✅ Future Improvements

Real-time stock data feed (API integration)

User authentication for personalized predictions

More advanced ML algorithms with model comparisons
