
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import StockChart from '@/components/stock/StockChart';
import ModelTrainer from '@/components/prediction/ModelTrainer';
import PredictionResult from '@/components/prediction/PredictionResult';
import StockTable from '@/components/stock/StockTable';
import { 
  generateMockStockData, 
  stockSymbols, 
  StockData, 
  generatePrediction, 
  addPredictionToData 
} from '@/utils/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles } from 'lucide-react';

const Prediction = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [predictionData, setPredictionData] = useState<StockData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [timeRange, setTimeRange] = useState('30');
  const [isLoading, setIsLoading] = useState(true);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [modelAccuracy, setModelAccuracy] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const newData = generateMockStockData(parseInt(timeRange), selectedSymbol);
      setStockData(newData);
      setIsLoading(false);
      
      // Reset prediction when stock or timeframe changes
      setPrediction(null);
      setPredictionData([]);
      setModelAccuracy(null);
    }, 800);
  }, [selectedSymbol, timeRange]);

  const handleModelTrained = (accuracy: number) => {
    setModelAccuracy(accuracy);
    
    // Generate prediction based on the model accuracy
    const newPrediction = generatePrediction(stockData, accuracy);
    setPrediction(newPrediction);
    
    // Add prediction to data for visualization
    const dataWithPrediction = addPredictionToData(stockData, newPrediction);
    setPredictionData(dataWithPrediction);
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newData = generateMockStockData(parseInt(timeRange), selectedSymbol);
      setStockData(newData);
      setIsLoading(false);
      
      // Regenerate prediction if a model exists
      if (modelAccuracy !== null) {
        const newPrediction = generatePrediction(newData, modelAccuracy);
        setPrediction(newPrediction);
        
        // Add prediction to data for visualization
        const dataWithPrediction = addPredictionToData(newData, newPrediction);
        setPredictionData(dataWithPrediction);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-app-darker">
      <Navbar onRefresh={refreshData} />
      
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Sparkles className="h-6 w-6 mr-2 text-app-blue" />
            <h1 className="text-2xl font-bold">Stock Price Prediction</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="w-full sm:w-[180px] bg-app-dark border-muted">
                <SelectValue placeholder="Select symbol" />
              </SelectTrigger>
              <SelectContent className="bg-app-dark border-muted">
                {stockSymbols.map(stock => (
                  <SelectItem key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-[150px] bg-app-dark border-muted">
                <SelectValue placeholder="Training data" />
              </SelectTrigger>
              <SelectContent className="bg-app-dark border-muted">
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="14">14 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <StockChart 
              data={predictionData.length > 0 ? predictionData : stockData} 
              title={`${selectedSymbol} Price History & Prediction`}
              showPredicted={predictionData.length > 0}
            />
          </div>
          
          <div>
            <div className="grid grid-cols-1 gap-6">
              <ModelTrainer 
                onModelTrained={handleModelTrained} 
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
              
              <PredictionResult 
                prediction={prediction} 
                currentData={stockData.length > 0 ? stockData[stockData.length - 1] : null}
                modelAccuracy={modelAccuracy}
              />
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="data" className="mt-6">
          <TabsList className="mb-4 bg-app-dark">
            <TabsTrigger value="data">Training Data</TabsTrigger>
            <TabsTrigger value="prediction" disabled={predictionData.length === 0}>Prediction Results</TabsTrigger>
          </TabsList>
          <TabsContent value="data" className="mt-0">
            <StockTable data={stockData} />
          </TabsContent>
          <TabsContent value="prediction" className="mt-0">
            {predictionData.length > 0 ? (
              <StockTable data={predictionData.slice(-10)} showPredicted={true} />
            ) : (
              <div className="bg-app-dark rounded-md p-6 text-center">
                <p className="text-app-gray">Train a model to see prediction results</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Prediction;
