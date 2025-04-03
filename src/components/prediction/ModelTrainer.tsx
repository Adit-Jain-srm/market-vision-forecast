
import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

interface ModelTrainerProps {
  onModelTrained: (accuracy: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ModelTrainer = ({ onModelTrained, isLoading, setIsLoading }: ModelTrainerProps) => {
  const [trainingDays, setTrainingDays] = useState<number[]>([30]);
  const [modelAccuracy, setModelAccuracy] = useState<number | null>(null);
  const [modelTrained, setModelTrained] = useState(false);

  const trainModel = () => {
    setIsLoading(true);
    // Simulate model training with a delay
    setTimeout(() => {
      // Random accuracy between 70% and 95%
      const accuracy = 70 + Math.random() * 25;
      setModelAccuracy(accuracy);
      setModelTrained(true);
      onModelTrained(accuracy);
      setIsLoading(false);
      toast({
        title: "Model training completed successfully",
        description: `Model trained with ${accuracy.toFixed(2)}% accuracy.`,
        variant: "default",
      });
    }, 2000);
  };

  const resetModel = () => {
    setModelAccuracy(null);
    setModelTrained(false);
    toast({
      title: "Model has been reset",
      description: "You can train a new model with different parameters.",
      variant: "default",
    });
  };

  return (
    <Card className="bg-app-dark border-muted animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-medium">ML Model Training</CardTitle>
        <CardDescription>Train a machine learning model to predict stock prices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-app-light-gray">Training Days</span>
            <span className="text-sm font-medium">{trainingDays[0]} days</span>
          </div>
          <Slider 
            value={trainingDays} 
            min={7} 
            max={90} 
            step={1} 
            onValueChange={setTrainingDays} 
            disabled={isLoading || modelTrained}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-app-gray">7 days</span>
            <span className="text-xs text-app-gray">90 days</span>
          </div>
        </div>

        <Alert className="bg-muted border-app-blue/20">
          <Info className="h-4 w-4 text-app-blue" />
          <AlertDescription className="text-xs text-app-light-gray">
            Using more training days may improve accuracy but requires more computing resources.
          </AlertDescription>
        </Alert>

        {modelAccuracy && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-app-light-gray">Model Status</span>
                <Badge variant="outline" className="bg-app-green/10 text-app-green border-app-green/20">
                  <CheckCircle className="h-3 w-3 mr-1" /> Trained
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-app-light-gray">Accuracy</span>
                <span className={`text-sm font-medium ${modelAccuracy > 85 ? 'text-app-green' : 'text-amber-500'}`}>
                  {modelAccuracy.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-app-light-gray">Data Points</span>
                <span className="text-sm font-medium">{trainingDays[0]}</span>
              </div>
              {modelAccuracy < 85 && (
                <Alert className="bg-amber-500/10 border-amber-500/20 mt-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-xs text-app-light-gray">
                    Model accuracy is below 85%. Consider using more training data.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!modelTrained ? (
          <Button 
            className="w-full bg-app-blue hover:bg-app-blue/90"
            onClick={trainModel}
            disabled={isLoading}
          >
            {isLoading ? "Training..." : "Train Model"}
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="w-1/2 border-muted text-app-light-gray hover:bg-muted"
              onClick={resetModel}
            >
              Reset Model
            </Button>
            <Button 
              className="w-1/2 bg-app-blue hover:bg-app-blue/90"
              onClick={trainModel}
            >
              Retrain Model
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ModelTrainer;
