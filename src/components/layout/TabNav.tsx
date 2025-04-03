
import React from 'react';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabNavProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNav = ({ tabs, activeTab, onTabChange }: TabNavProps) => {
  return (
    <div className="flex border-b border-muted mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn(
            "flex items-center px-4 py-3 focus:outline-none transition-colors",
            activeTab === tab.id ? "tab-active" : "tab-inactive"
          )}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNav;
