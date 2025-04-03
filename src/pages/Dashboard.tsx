
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import StockChart from '@/components/stock/StockChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateMockStockData, stockSymbols, StockData } from '@/utils/mockData';
import { Activity, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [timeRange, setTimeRange] = useState('30');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    setTimeout(() => {
      const newData = generateMockStockData(parseInt(timeRange), selectedSymbol);
      setStockData(newData);
      setIsLoading(false);
    }, 500);
  }, [selectedSymbol, timeRange]);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newData = generateMockStockData(parseInt(timeRange), selectedSymbol);
      setStockData(newData);
      setIsLoading(false);
    }, 500);
  };

  // Calculate summary metrics
  const getLatestPrice = () => {
    if (stockData.length === 0) return { price: 0, change: 0, percentChange: 0 };
    
    const latest = stockData[stockData.length - 1];
    const previous = stockData.length > 1 ? stockData[stockData.length - 2] : latest;
    
    const price = latest.close;
    const change = latest.close - previous.close;
    const percentChange = (change / previous.close) * 100;
    
    return { price, change, percentChange };
  };

  const getHighLowData = () => {
    if (stockData.length === 0) return { high: 0, low: 0, range: 0 };
    
    const high = Math.max(...stockData.map(d => d.high));
    const low = Math.min(...stockData.map(d => d.low));
    const range = ((high - low) / low) * 100;
    
    return { high, low, range };
  };

  const getVolumeData = () => {
    if (stockData.length === 0) return { average: 0, highest: 0 };
    
    const volumes = stockData.map(d => d.volume);
    const average = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    const highest = Math.max(...volumes);
    
    return { average, highest };
  };

  const { price, change, percentChange } = getLatestPrice();
  const { high, low, range } = getHighLowData();
  const { average: avgVolume } = getVolumeData();

  return (
    <div className="min-h-screen bg-app-darker">
      <Navbar onRefresh={refreshData} />
      <div className="container py-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold mb-4 md:mb-0">Market Overview</h2>
            <div className="flex space-x-2 w-full md:w-auto">
              <Select 
                value={selectedSymbol} 
                onValueChange={setSelectedSymbol}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-app-dark border-muted">
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
              
              <Select 
                value={timeRange} 
                onValueChange={setTimeRange}
              >
                <SelectTrigger className="w-full md:w-[150px] bg-app-dark border-muted">
                  <SelectValue placeholder="Time range" />
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-app-dark border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-app-light-gray">Current Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-app-light-gray" />
                  <div>
                    <div className="text-2xl font-bold">${price.toFixed(2)}</div>
                    <div className={`text-sm ${change >= 0 ? 'text-app-green' : 'text-app-red'}`}>
                      {change >= 0 ? <TrendingUp className="h-3 w-3 inline mr-1" /> : <TrendingDown className="h-3 w-3 inline mr-1" />}
                      {change.toFixed(2)} ({percentChange.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-app-dark border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-app-light-gray">Range (Period)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-app-light-gray" />
                  <div>
                    <div className="text-2xl font-bold">${low.toFixed(2)} - ${high.toFixed(2)}</div>
                    <div className="text-sm text-app-light-gray">
                      {range.toFixed(2)}% range
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-app-dark border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-app-light-gray">Average Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-app-light-gray" />
                  <div>
                    <div className="text-2xl font-bold">{(avgVolume / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-app-light-gray">
                      shares per day
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-app-dark border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-app-light-gray">Data Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-app-light-gray" />
                  <div>
                    <div className="text-2xl font-bold">{stockData.length}</div>
                    <div className="text-sm text-app-light-gray">
                      trading days
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="price">
            <TabsList className="mb-4 bg-app-dark">
              <TabsTrigger value="price">Price History</TabsTrigger>
              <TabsTrigger value="volume">Volume History</TabsTrigger>
            </TabsList>
            <TabsContent value="price" className="mt-0">
              <StockChart data={stockData} title={`${selectedSymbol} Price History - ${timeRange} Days`} />
            </TabsContent>
            <TabsContent value="volume" className="mt-0">
              <Card className="bg-app-dark border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">{`${selectedSymbol} Volume History - ${timeRange} Days`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    {stockData.length > 0 && (
                      <div className="w-full h-full flex items-center justify-center">
                        {/* We show volume chart here, similar to the price chart but with volume data */}
                        <StockChart 
                          data={stockData.map(item => ({
                            ...item,
                            close: item.volume / 1000000 // Show volume in millions
                          }))} 
                          title="" 
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
