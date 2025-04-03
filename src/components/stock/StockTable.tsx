import React, { useState } from 'react';
import { ArrowUpDown, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  predicted?: number;
}

interface StockTableProps {
  data: StockData[];
  showPredicted?: boolean;
}

const isIndianStock = (symbol: string): boolean => {
  const indianSymbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'BHARTIARTL'];
  return indianSymbols.includes(symbol);
};

const StockTable = ({ data, showPredicted = false }: StockTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof StockData>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const symbol = searchParams.get('symbol') || 'AAPL';
  const isIndian = isIndianStock(symbol);

  const handleSort = (field: keyof StockData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredData = data.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.date.toLowerCase().includes(searchLower) ||
      item.open.toString().includes(searchTerm) ||
      item.close.toString().includes(searchTerm)
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(aValue as string).getTime() - new Date(bValue as string).getTime()
        : new Date(bValue as string).getTime() - new Date(aValue as string).getTime();
    }
    
    return sortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const formatPrice = (price: number) => {
    return isIndian ? `₹${price.toFixed(2)}` : `$${price.toFixed(2)}`;
  };

  const formatVolume = (volume: number) => {
    return volume.toLocaleString();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const handleExport = () => {
    const headers = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume'];
    if (showPredicted) headers.push('Predicted');
    
    const csvContent = [
      headers.join(','),
      ...sortedData.map(row => {
        const values = [
          formatDate(row.date),
          row.open.toFixed(2),
          row.high.toFixed(2),
          row.low.toFixed(2),
          row.close.toFixed(2),
          row.volume.toString()
        ];
        if (showPredicted && row.predicted !== undefined) {
          values.push(row.predicted.toFixed(2));
        }
        return values.join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `stock_data_${symbol}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-app-dark rounded-md border border-muted p-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-app-gray" />
          <Input
            placeholder="Search by date or price..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-app-darker border-muted text-app-light-gray"
          />
        </div>
        <div className="flex space-x-2">
          <Select defaultValue="date">
            <SelectTrigger className="w-36 bg-app-darker border-muted text-app-light-gray">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-app-dark border-muted">
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="close">Close</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="bg-app-darker border-muted text-app-light-gray hover:bg-muted"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th 
                className="cursor-pointer hover:bg-muted" 
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted" 
                onClick={() => handleSort('open')}
              >
                <div className="flex items-center">
                  Open
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted" 
                onClick={() => handleSort('high')}
              >
                <div className="flex items-center">
                  High
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted" 
                onClick={() => handleSort('low')}
              >
                <div className="flex items-center">
                  Low
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted" 
                onClick={() => handleSort('close')}
              >
                <div className="flex items-center">
                  Close
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted" 
                onClick={() => handleSort('volume')}
              >
                <div className="flex items-center">
                  Volume
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </th>
              {showPredicted && (
                <th 
                  className="cursor-pointer hover:bg-muted" 
                  onClick={() => handleSort('predicted')}
                >
                  <div className="flex items-center">
                    Predicted
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <tr key={index}>
                  <td>{formatDate(item.date)}</td>
                  <td>{formatPrice(item.open)}</td>
                  <td>{formatPrice(item.high)}</td>
                  <td>{formatPrice(item.low)}</td>
                  <td>{formatPrice(item.close)}</td>
                  <td>{formatVolume(item.volume)}</td>
                  {showPredicted && item.predicted !== undefined && (
                    <td className="text-app-green">{formatPrice(item.predicted)}</td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={showPredicted ? 7 : 6} className="text-center py-8 text-app-gray">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;
