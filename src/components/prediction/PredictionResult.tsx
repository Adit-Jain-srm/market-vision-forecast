
import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PredictionResultProps {
  prediction: number | null;
  currentData: StockData | null;
  modelAccuracy: number | null;
}

const PredictionResult = ({ prediction, currentData, modelAccuracy }: PredictionResultProps) => {
  if (!prediction || !currentData) {
    return (
      <Card className="bg-app-dark border-muted h-full animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Price Prediction</CardTitle>
          <CardDescription>Train a model to see tomorrow's predicted price</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-app-gray">No prediction available</p>
          <p className="text-xs text-app-gray mt-1">Train a model to generate predictions</p>
        </CardContent>
      </Card>
    );
  }

  const changeAmount = prediction - currentData.close;
  const changePercent = (changeAmount / currentData.close) * 100;
  const isPositive = changeAmount > 0;

  // Today's date + 1 day for tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="bg-app-dark border-muted h-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          Price Prediction
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-app-gray cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-app-darker border-muted">
                <p className="text-xs text-app-light-gray">
                  Prediction based on model with {modelAccuracy?.toFixed(1)}% accuracy
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>For {tomorrowFormatted}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-3xl font-bold">${prediction.toFixed(2)}</h3>
          <div className={`flex items-center justify-center mt-2 ${isPositive ? 'text-app-green' : 'text-app-red'}`}>
            {isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
            <span className="text-sm font-medium">${Math.abs(changeAmount).toFixed(2)} ({Math.abs(changePercent).toFixed(2)}%)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-md p-3">
            <p className="text-xs text-app-gray mb-1">Current Close</p>
            <p className="text-sm font-medium">${currentData.close.toFixed(2)}</p>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="text-xs text-app-gray mb-1">Current Range</p>
            <p className="text-sm font-medium">${currentData.low.toFixed(2)} - ${currentData.high.toFixed(2)}</p>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="text-xs text-app-gray mb-1">Expected Low</p>
            <p className="text-sm font-medium">${(prediction * 0.98).toFixed(2)}</p>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="text-xs text-app-gray mb-1">Expected High</p>
            <p className="text-sm font-medium">${(prediction * 1.02).toFixed(2)}</p>
          </div>
        </div>

        {modelAccuracy && modelAccuracy < 85 && (
          <div className="text-xs text-amber-500 italic mt-4">
            Note: Model accuracy is {modelAccuracy.toFixed(1)}%. Results should be viewed as estimates only.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionResult;
