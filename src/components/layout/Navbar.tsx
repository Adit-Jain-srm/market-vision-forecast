
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navbar = ({ onRefresh }: { onRefresh?: () => void }) => {
  return (
    <div className="flex items-center justify-between bg-app-dark p-4 border-b border-muted">
      <h1 className="text-xl font-bold text-white">Market Vision Forecast</h1>
      <div className="flex items-center space-x-4">
        <nav className="hidden md:flex space-x-6 mr-4">
          <Link to="/" className="text-app-light-gray hover:text-white transition-colors">Dashboard</Link>
          <Link to="/explorer" className="text-app-light-gray hover:text-white transition-colors">Data Explorer</Link>
          <Link to="/prediction" className="text-app-light-gray hover:text-white transition-colors">Prediction</Link>
        </nav>
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-app-light-gray border-muted hover:bg-app-dark hover:text-white"
            onClick={onRefresh}
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh Data
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
