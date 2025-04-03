import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import StockTable from '@/components/stock/StockTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, BarChart3, Table, Code, GitBranch } from 'lucide-react';
import TabNav from '@/components/layout/TabNav';
import { generateMockStockData, stockSymbols, StockData } from '@/utils/mockData';
import SchemaVisualizer from '@/components/database/SchemaVisualizer';
import SqlQueryPanel from '@/components/database/SqlQueryPanel';

const DataExplorer = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [timeRange, setTimeRange] = useState('30');
  const [activeTab, setActiveTab] = useState('tableView');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  const tabs = [
    {
      id: 'tableView',
      label: 'Table View',
      icon: <Table className="h-4 w-4" />,
    },
    {
      id: 'statsView',
      label: 'Statistics',
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      id: 'schemaView',
      label: 'Schema Diagram',
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      id: 'sqlView',
      label: 'SQL Query',
      icon: <Code className="h-4 w-4" />,
    }
  ];

  return (
    <div className="min-h-screen bg-app-darker">
      <Navbar onRefresh={refreshData} />
      
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Database className="h-6 w-6 mr-2 text-app-blue" />
            <h1 className="text-2xl font-bold">Stock Database Explorer</h1>
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

        <div className="bg-app-dark rounded-md border border-muted mb-6 p-4">
          <p className="text-app-light-gray text-sm">
            Browse, search, and export stock data for {selectedSymbol}. 
            {stockData.length > 0 && ` Showing ${stockData.length} trading days of historical data.`}
          </p>
        </div>
        
        <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'tableView' && (
          <StockTable data={stockData} />
        )}
        
        {activeTab === 'statsView' && (
          <div className="bg-app-dark rounded-md border border-muted p-4 animate-fade-in">
            <h3 className="text-lg font-medium mb-4">Statistical Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stockData.length > 0 && (
                <>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-app-gray mb-1">Average Close</p>
                    <p className="text-xl font-medium">
                      ${(stockData.reduce((acc, day) => acc + day.close, 0) / stockData.length).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-app-gray mb-1">Highest Price</p>
                    <p className="text-xl font-medium">
                      ${Math.max(...stockData.map(day => day.high)).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-app-gray mb-1">Lowest Price</p>
                    <p className="text-xl font-medium">
                      ${Math.min(...stockData.map(day => day.low)).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-app-gray mb-1">Total Volume</p>
                    <p className="text-xl font-medium">
                      {(stockData.reduce((acc, day) => acc + day.volume, 0) / 1000000).toFixed(2)}M
                    </p>
                  </div>
                </>
              )}
            </div>
            
            <h3 className="text-lg font-medium mb-4">Price Movement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stockData.length > 0 && (
                <>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-app-gray mb-1">Volatility (Avg Daily Range %)</p>
                    <p className="text-xl font-medium">
                      {(stockData.reduce((acc, day) => 
                        acc + ((day.high - day.low) / day.low) * 100, 0) / stockData.length).toFixed(2)}%
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-app-gray mb-1">Overall Change</p>
                    {stockData.length > 1 && (
                      <p className={`text-xl font-medium ${
                        stockData[stockData.length - 1].close > stockData[0].close 
                          ? 'text-app-green' 
                          : 'text-app-red'
                      }`}>
                        {((stockData[stockData.length - 1].close - stockData[0].close) / stockData[0].close * 100).toFixed(2)}%
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'schemaView' && (
          <SchemaVisualizer symbol={selectedSymbol} />
        )}
        
        {activeTab === 'sqlView' && (
          <SqlQueryPanel data={stockData} symbol={selectedSymbol} />
        )}
      </div>
    </div>
  );
};

export default DataExplorer;
