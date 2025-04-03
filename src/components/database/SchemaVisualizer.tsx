
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface SchemaVisualizerProps {
  symbol: string;
}

const SchemaVisualizer = ({ symbol }: SchemaVisualizerProps) => {
  const [activeView, setActiveView] = useState('er');
  const [zoomLevel, setZoomLevel] = useState(1);

  // Entity-Relationship Diagram Elements
  const entities = [
    { id: 'stock', name: 'Stock', attributes: ['symbol (PK)', 'name', 'sector', 'industry', 'ceo', 'founded_year'] },
    { id: 'price_history', name: 'PriceHistory', attributes: ['id (PK)', 'stock_symbol (FK)', 'date', 'open', 'high', 'low', 'close', 'volume'] },
    { id: 'prediction', name: 'Prediction', attributes: ['id (PK)', 'stock_symbol (FK)', 'date', 'predicted_price', 'model_id (FK)', 'accuracy'] },
    { id: 'model', name: 'Model', attributes: ['id (PK)', 'name', 'algorithm', 'created_at', 'parameters', 'accuracy'] },
  ];

  const relationships = [
    { from: 'stock', to: 'price_history', type: 'one-to-many', label: 'has' },
    { from: 'stock', to: 'prediction', type: 'one-to-many', label: 'receives' },
    { from: 'model', to: 'prediction', type: 'one-to-many', label: 'produces' },
  ];

  // Relational schema (SQL tables definition)
  const sqlSchema = `
CREATE TABLE Stock (
  symbol VARCHAR(10) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sector VARCHAR(100),
  industry VARCHAR(100),
  ceo VARCHAR(100),
  founded_year INT
);

CREATE TABLE PriceHistory (
  id SERIAL PRIMARY KEY,
  stock_symbol VARCHAR(10) REFERENCES Stock(symbol),
  date DATE NOT NULL,
  open DECIMAL(10,2) NOT NULL,
  high DECIMAL(10,2) NOT NULL,
  low DECIMAL(10,2) NOT NULL,
  close DECIMAL(10,2) NOT NULL,
  volume BIGINT NOT NULL,
  UNIQUE(stock_symbol, date)
);

CREATE TABLE Model (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  algorithm VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  parameters JSONB,
  accuracy DECIMAL(5,2)
);

CREATE TABLE Prediction (
  id SERIAL PRIMARY KEY,
  stock_symbol VARCHAR(10) REFERENCES Stock(symbol),
  date DATE NOT NULL,
  predicted_price DECIMAL(10,2) NOT NULL,
  model_id INT REFERENCES Model(id),
  accuracy DECIMAL(5,2),
  UNIQUE(stock_symbol, date, model_id)
);

-- Indexes for better query performance
CREATE INDEX idx_price_history_stock_symbol ON PriceHistory(stock_symbol);
CREATE INDEX idx_price_history_date ON PriceHistory(date);
CREATE INDEX idx_prediction_stock_symbol ON Prediction(stock_symbol);
CREATE INDEX idx_prediction_date ON Prediction(date);
CREATE INDEX idx_prediction_model_id ON Prediction(model_id);
  `;

  // Sample queries
  const sampleQueries = [
    {
      name: "Get latest price",
      query: `SELECT * FROM PriceHistory 
WHERE stock_symbol = '${symbol}' 
ORDER BY date DESC 
LIMIT 1;`
    },
    {
      name: "Calculate moving average",
      query: `SELECT 
  date, 
  close,
  AVG(close) OVER (
    ORDER BY date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7d
FROM PriceHistory
WHERE stock_symbol = '${symbol}'
ORDER BY date DESC
LIMIT 30;`
    },
    {
      name: "Prediction accuracy",
      query: `SELECT 
  p.date, 
  p.predicted_price, 
  ph.close AS actual_price,
  ABS(p.predicted_price - ph.close) / ph.close * 100 AS error_percent
FROM Prediction p
JOIN PriceHistory ph ON p.stock_symbol = ph.stock_symbol AND p.date = ph.date
WHERE p.stock_symbol = '${symbol}'
ORDER BY p.date DESC
LIMIT 10;`
    }
  ];

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleDownload = () => {
    // Placeholder for download functionality
    // In a real app, this would generate an image or PDF of the current diagram
    alert("Diagram download functionality would be implemented here");
  };

  return (
    <div className="bg-app-dark rounded-md border border-muted p-4 animate-fade-in">
      <Tabs defaultValue="er" value={activeView} onValueChange={setActiveView}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="er">Entity-Relationship</TabsTrigger>
            <TabsTrigger value="relational">Relational Schema</TabsTrigger>
            <TabsTrigger value="queries">Sample Queries</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="er" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Entity-Relationship Diagram</CardTitle>
              <CardDescription>
                Visual representation of the database structure for stock data analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="er-diagram border rounded-md p-6 bg-app-darker overflow-auto" 
                style={{ 
                  minHeight: '500px',
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center top'
                }}
              >
                {/* Entities */}
                <div className="grid grid-cols-2 gap-6">
                  {entities.map(entity => (
                    <div 
                      key={entity.id} 
                      className="entity-box border rounded-md bg-muted p-4 shadow-md"
                    >
                      <h3 className="text-lg font-semibold mb-2 text-center border-b pb-2">{entity.name}</h3>
                      <ul className="space-y-1">
                        {entity.attributes.map((attr, idx) => (
                          <li key={idx} className="text-sm">
                            {attr.includes('(PK)') ? (
                              <span className="font-semibold text-app-blue">{attr}</span>
                            ) : attr.includes('(FK)') ? (
                              <span className="italic text-app-green">{attr}</span>
                            ) : (
                              <span>{attr}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Relationships - Simplified representation */}
                <div className="relationships mt-6 flex flex-col space-y-2">
                  {relationships.map((rel, idx) => (
                    <div key={idx} className="flex items-center justify-center space-x-4 p-2">
                      <span className="font-semibold">{entities.find(e => e.id === rel.from)?.name}</span>
                      <div className="flex flex-col items-center">
                        <span className="text-xs bg-app-blue/20 px-2 py-1 rounded">{rel.label}</span>
                        <div className="flex items-center space-x-1">
                          <span>{rel.type === 'one-to-many' ? '1' : 'N'}</span>
                          <span className="text-app-blue">—</span>
                          <span>{rel.type === 'one-to-many' ? 'N' : '1'}</span>
                        </div>
                      </div>
                      <span className="font-semibold">{entities.find(e => e.id === rel.to)?.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relational" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Relational Schema</CardTitle>
              <CardDescription>
                SQL table definitions for the stock database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-app-darker rounded-md p-4 font-mono text-sm overflow-auto">
                <pre className="whitespace-pre-wrap">{sqlSchema}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queries" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Sample SQL Queries</CardTitle>
              <CardDescription>
                Common queries for analyzing stock data for {symbol}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleQueries.map((q, idx) => (
                  <div key={idx} className="query-box border rounded-md p-4 bg-app-darker">
                    <h3 className="font-semibold mb-2">{q.name}</h3>
                    <pre className="bg-muted p-3 rounded text-xs overflow-auto">{q.query}</pre>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchemaVisualizer;
