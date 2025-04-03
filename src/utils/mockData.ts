
// Generate realistic stock price data for demo purposes
export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  predicted?: number;
}

// Get a random value within a range
const getRandomValue = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Generate a stock price with some random walk behavior
const generateStockPrice = (prevClose: number): { open: number, high: number, low: number, close: number } => {
  // Random daily change percentage (typically between -3% and 3%)
  const dailyChangePercent = getRandomValue(-3, 3) / 100;
  
  // Calculate basic open/close with randomness
  const open = prevClose * (1 + getRandomValue(-1, 1) / 100);
  const close = prevClose * (1 + dailyChangePercent);
  
  // Calculate high and low with realistic ranges
  const volatilityPercent = getRandomValue(1, 2) / 100;
  const high = Math.max(open, close) * (1 + volatilityPercent);
  const low = Math.min(open, close) * (1 - volatilityPercent);
  
  return { 
    open: parseFloat(open.toFixed(2)), 
    high: parseFloat(high.toFixed(2)), 
    low: parseFloat(low.toFixed(2)), 
    close: parseFloat(close.toFixed(2))
  };
};

// Generate mock stock data for the past N days
export const generateMockStockData = (days: number = 90, symbol: string = 'AAPL'): StockData[] => {
  const data: StockData[] = [];
  
  // Set a starting price based on the symbol
  let basePrice: number;
  switch(symbol) {
    case 'AAPL': basePrice = 180; break;
    case 'MSFT': basePrice = 350; break;
    case 'AMZN': basePrice = 140; break;
    case 'GOOGL': basePrice = 130; break;
    case 'TSLA': basePrice = 220; break;
    // Indian companies
    case 'RELIANCE': basePrice = 2500; break;
    case 'TCS': basePrice = 3700; break;
    case 'HDFCBANK': basePrice = 1600; break;
    case 'INFY': basePrice = 1450; break;
    case 'BHARTIARTL': basePrice = 950; break;
    default: basePrice = 100;
  }
  
  // Generate data for each day, starting from the past
  const endDate = new Date();
  let currentDate = new Date();
  currentDate.setDate(endDate.getDate() - days);
  
  let prevClose = basePrice;
  
  while (currentDate <= endDate) {
    // Skip weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      const { open, high, low, close } = generateStockPrice(prevClose);
      
      // Generate realistic volume (higher on volatile days)
      const volumeBase = ['AAPL', 'RELIANCE', 'TCS'].includes(symbol) ? 80000000 : 40000000;
      const volumeVariation = Math.abs(close - prevClose) / prevClose;
      const volume = Math.round(volumeBase * (1 + volumeVariation * 10));
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        open,
        high,
        low,
        close,
        volume
      });
      
      prevClose = close;
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
};

// Generate a prediction for the next day
export const generatePrediction = (data: StockData[], accuracy: number = 85): number => {
  if (data.length === 0) return 0;
  
  const lastDay = data[data.length - 1];
  
  // Perfect prediction would use some complex model, but here we use simple linear extrapolation
  // based on the last few days with some randomness to simulate model imperfection
  
  // Simple moving average of the last 5 days
  const lastFewDays = data.slice(-5);
  const avgClose = lastFewDays.reduce((sum, day) => sum + day.close, 0) / lastFewDays.length;
  
  // Trend direction and magnitude
  const trend = lastDay.close - avgClose;
  
  // Perfect prediction (if model was 100% accurate)
  const perfectPrediction = lastDay.close + trend;
  
  // Add error based on the accuracy
  const errorRange = lastDay.close * ((100 - accuracy) / 100);
  const error = getRandomValue(-errorRange, errorRange);
  
  const prediction = perfectPrediction + error;
  
  return parseFloat(prediction.toFixed(2));
};

// Add prediction to the last row of data
export const addPredictionToData = (data: StockData[], prediction: number): StockData[] => {
  const newData = [...data];
  if (newData.length > 0) {
    // Create a new date for the prediction (next day after the last data point)
    const lastDate = new Date(newData[newData.length - 1].date);
    let nextDate = new Date(lastDate);
    
    // Skip to the next business day (skip weekends)
    do {
      nextDate.setDate(nextDate.getDate() + 1);
    } while (nextDate.getDay() === 0 || nextDate.getDay() === 6);
    
    // Get values from the last day as a starting point
    const lastDay = newData[newData.length - 1];
    
    // Create predicted day data
    const predictedDay: StockData = {
      date: nextDate.toISOString().split('T')[0],
      open: prediction * 0.998, // Slight difference between predicted close and open
      high: prediction * 1.01,
      low: prediction * 0.99,
      close: prediction,
      volume: lastDay.volume * (0.8 + Math.random() * 0.4), // Random volume similar to last day
      predicted: prediction
    };
    
    // Add to the data array
    newData.push(predictedDay);
  }
  
  return newData;
};

// Generate initial stock symbols for the app
export const stockSymbols = [
  // US Companies
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  // Indian Companies
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
  { symbol: 'INFY', name: 'Infosys Ltd.' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.' }
];
