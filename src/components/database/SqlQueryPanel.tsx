
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Play, Save, Database, FileUp, FileDown, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SqlQueryPanelProps {
  data: any[];
  symbol: string;
}

const SqlQueryPanel = ({ data, symbol }: SqlQueryPanelProps) => {
  const [query, setQuery] = useState(`-- Enter your SQL query here
SELECT * FROM PriceHistory 
WHERE stock_symbol = '${symbol}' 
ORDER BY date DESC 
LIMIT 10;`);
  
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [savedQueries, setSavedQueries] = useState<{name: string, query: string}[]>([
    { 
      name: "Latest prices", 
      query: `SELECT date, open, high, low, close, volume FROM PriceHistory 
WHERE stock_symbol = '${symbol}' 
ORDER BY date DESC 
LIMIT 20;` 
    },
    { 
      name: "Volatility by month", 
      query: `SELECT 
  DATE_TRUNC('month', date) AS month,
  AVG((high - low) / low * 100) AS avg_daily_volatility
FROM PriceHistory
WHERE stock_symbol = '${symbol}'
GROUP BY DATE_TRUNC('month', date)
ORDER BY month DESC;` 
    },
    { 
      name: "Volume analysis", 
      query: `SELECT 
  date, 
  close, 
  volume,
  LAG(volume, 1) OVER (ORDER BY date) AS prev_day_volume,
  CASE 
    WHEN volume > LAG(volume, 1) OVER (ORDER BY date) THEN 'Increasing'
    ELSE 'Decreasing'
  END AS volume_trend
FROM PriceHistory
WHERE stock_symbol = '${symbol}'
ORDER BY date DESC
LIMIT 15;` 
    }
  ]);

  const executeQuery = () => {
    // In a real app, this would send the query to a backend
    // Here we'll simulate the execution using the mock data
    setIsExecuting(true);
    const startTime = performance.now();
    
    setTimeout(() => {
      try {
        // Simple query parser to simulate SQL functionality
        // This is just a demonstration - a real app would use a proper SQL parser
        let result = [...data];
        
        // Simulate simple SQL operations
        if (query.toLowerCase().includes('limit')) {
          const limitMatch = query.match(/limit\s+(\d+)/i);
          if (limitMatch && limitMatch[1]) {
            const limit = parseInt(limitMatch[1]);
            result = result.slice(0, limit);
          }
        }
        
        if (query.toLowerCase().includes('order by')) {
          const orderMatch = query.match(/order by\s+(\w+)\s+(asc|desc)?/i);
          if (orderMatch && orderMatch[1]) {
            const field = orderMatch[1].toLowerCase();
            const direction = orderMatch[2]?.toLowerCase() || 'asc';
            
            result.sort((a, b) => {
              if (field === 'date') {
                return direction === 'asc'
                  ? new Date(a.date).getTime() - new Date(b.date).getTime()
                  : new Date(b.date).getTime() - new Date(a.date).getTime();
              }
              
              return direction === 'asc'
                ? a[field] - b[field]
                : b[field] - a[field];
            });
          }
        }
        
        setQueryResult(result);
        
        // Add to history if not already there
        if (!queryHistory.includes(query)) {
          setQueryHistory(prev => [query, ...prev].slice(0, 10));
        }
        
        const endTime = performance.now();
        setExecutionTime(endTime - startTime);
        
        toast({
          title: "Query executed successfully",
          description: `Returned ${result.length} rows in ${(endTime - startTime).toFixed(2)}ms`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error executing query",
          description: String(error),
          variant: "destructive",
        });
      } finally {
        setIsExecuting(false);
      }
    }, 800); // Simulate execution time
  };

  const loadSavedQuery = (queryText: string) => {
    setQuery(queryText);
  };

  const saveCurrentQuery = () => {
    const name = prompt("Enter a name for this query:");
    if (name) {
      setSavedQueries(prev => [...prev, { name, query }]);
      toast({
        title: "Query saved",
        description: `Saved query "${name}" to your collection`,
        variant: "default",
      });
    }
  };

  return (
    <div className="bg-app-dark rounded-md border border-muted p-4 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left sidebar with saved queries */}
        <div className="lg:col-span-1 bg-app-darker p-4 rounded-md">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <Save className="mr-2 h-4 w-4" />
            Saved Queries
          </h3>
          <div className="space-y-2">
            {savedQueries.map((savedQuery, index) => (
              <div 
                key={index} 
                className="cursor-pointer p-2 hover:bg-muted rounded"
                onClick={() => loadSavedQuery(savedQuery.query)}
              >
                <h4 className="font-medium text-sm truncate">{savedQuery.name}</h4>
                <p className="text-xs text-app-gray truncate">
                  {savedQuery.query.substring(0, 40)}...
                </p>
              </div>
            ))}
          </div>
          
          <h3 className="text-lg font-semibold flex items-center mb-4 mt-6">
            <Clock className="mr-2 h-4 w-4" />
            Query History
          </h3>
          <div className="space-y-2">
            {queryHistory.map((historyItem, index) => (
              <div 
                key={index} 
                className="cursor-pointer p-2 hover:bg-muted rounded"
                onClick={() => loadSavedQuery(historyItem)}
              >
                <p className="text-xs text-app-gray truncate">
                  {historyItem.substring(0, 50)}...
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main query editor and results area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <Database className="mr-2 h-5 w-5" />
              SQL Query Editor
            </h3>
            
            <div className="flex space-x-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={executeQuery}
                disabled={isExecuting}
              >
                <Play className="mr-1 h-4 w-4" />
                {isExecuting ? 'Executing...' : 'Execute'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={saveCurrentQuery}
              >
                <Save className="mr-1 h-4 w-4" />
                Save
              </Button>
              
              <Button variant="outline" size="sm">
                <FileUp className="mr-1 h-4 w-4" />
                Load
              </Button>
              
              <Button variant="outline" size="sm">
                <FileDown className="mr-1 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="query-editor bg-app-darker rounded-md">
            <textarea
              className="w-full p-4 font-mono text-sm bg-transparent border-0 focus:ring-0 resize-y"
              rows={8}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
            />
          </div>
          
          {executionTime !== null && (
            <p className="text-xs text-app-gray">
              Query executed in {executionTime.toFixed(2)}ms
            </p>
          )}
          
          <div className="query-results">
            <h3 className="text-lg font-semibold mb-2">Results</h3>
            
            {queryResult.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(queryResult[0]).map((key) => (
                        <TableHead key={key}>{key}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queryResult.map((row, i) => (
                      <TableRow key={i}>
                        {Object.values(row).map((value: any, j) => (
                          <TableCell key={j}>
                            {typeof value === 'number' 
                              ? value.toLocaleString(undefined, { 
                                  maximumFractionDigits: 2 
                                })
                              : String(value)
                            }
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="bg-app-darker rounded-md p-6 text-center text-app-gray">
                Execute a query to see results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SqlQueryPanel;
