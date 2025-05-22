import React, { FC, useState } from "react";

interface DropdownProps {
  options: string[];
  displayOptions?: string[];
  rounded?: boolean;
  label?: string;
  selectedOption?: string;
  onChange?: (value: string) => void;
}

const Dropdown: FC<DropdownProps> = ({ options, displayOptions, rounded, label, onChange, selectedOption }) => {
  const [selection, updateSelection] = useState<string>(selectedOption || options[0]);
  
  // Handle dropdown selection change
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (onChange) await onChange(value);
    if (selectedOption) {
      updateSelection(selectedOption);
    } else {
      updateSelection(value);
    }
  };

  return (
    <div className="relative">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Custom select styling with gradient border */}
        <div className={`relative ${rounded ? 'rounded-full' : 'rounded-lg'} p-[1px] bg-gradient-to-r from-primary/50 to-secondary/50 dark:from-dark-accent-primary/50 dark:to-dark-accent-tertiary/50`}>
          <select
            value={selectedOption || selection}
            onChange={handleChange}
            className={`
              w-full appearance-none bg-white dark:bg-dark-bg-tertiary 
              ${rounded ? 'rounded-full pl-4 pr-10 py-2' : 'rounded-lg p-3 pr-10'} 
              text-gray-900 dark:text-dark-text-primary border-none focus:ring-1 focus:ring-primary dark:focus:ring-dark-accent-primary
              text-sm outline-none shadow-none transition duration-200 focus:shadow-glow
            `}
          >
            {options.map((option) => (
              <option key={option} value={option} className="bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-dark-text-primary py-2">
                {displayOptions?.[options.indexOf(option)] || option}
              </option>
            ))}
          </select>
        </div>
        
        {/* Custom dropdown icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-dark-text-tertiary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
