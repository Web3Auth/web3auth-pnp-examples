import React from "react";

interface TabsProps {
  tabData: { tabName: string; onClick?: any; active?: boolean }[];
}

function renderTab(tabName: string, onClick?: any, active?: boolean) {
  if (active) {
    return (
      <a onClick={onClick} className="p-4 text-lg font-bold -mb-px border-b-2 border-current text-primary dark:text-dark-accent-primary cursor-pointer">
        {tabName}
      </a>
    );
  }
  return (
    <a onClick={onClick} className="p-4 text-lg font-bold -mb-px border-b border-transparent text-gray-700 dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-accent-primary cursor-pointer">
      {tabName}
    </a>
  );
}

function Tabs({ tabData }: TabsProps) {
  return (
    <nav className="w-full px-4 sm:px-6 lg:px-8 flex text-sm font-medium border-b border-gray-100 dark:border-dark-border-primary mb-2 justify-center">
      {tabData.map((tab) => renderTab(tab.tabName, tab.onClick, tab.active))}
    </nav>
  );
}

export default Tabs;
