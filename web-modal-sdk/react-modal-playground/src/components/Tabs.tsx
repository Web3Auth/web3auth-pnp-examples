import React from "react";

interface TabsProps {
  tabData: { tabName: string; onClick?: any; active?: boolean }[];
}

function renderTab(tabName: string, onClick?: any, active?: boolean) {
  if (active) {
    return (
      <a onClick={onClick} className="p-4 text-lg font-bold -mb-px border-b-2 border-current text-primary cursor-pointer">
        {tabName}
      </a>
    );
  }
  return (
    <a onClick={onClick} className="p-4 text-lg font-bold -mb-px border-b border-transparent hover:text-primary cursor-pointer">
      {tabName}
    </a>
  );
}

function Tabs({ tabData }: TabsProps) {
  return (
    <nav className="w-11/12 px-4 sm:px-6 lg:px-8 flex text-sm font-medium border-b border-gray-100">
      {tabData.map((tab) => renderTab(tab.tabName, tab.onClick, tab.active))}
    </nav>
  );
}

export default Tabs;
