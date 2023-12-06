import React, { FC, useState } from "react";

import { useWeb3Auth } from "../services/web3auth";

interface DropdownProps {
  options: string[];
  rounded?: boolean;
  label?: string;
  onChange?: (value: string) => void;
}

const Dropdown: FC<DropdownProps> = ({ options, rounded, label, onChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>(options[0] || "");
  let classSelect: string;
  if (rounded) {
    classSelect = "w-full pl-4	pr-12 text-sm border-gray-200 rounded-full z-0";
  } else {
    classSelect = "w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm z-0";
  }
  const { switchChain } = useWeb3Auth();

  const handleChange = (e: any) => {
    const { value } = e.target;
    setSelectedOption(value);
    switchChain(value);
    if (onChange) onChange(value);
  };

  return (
    <div>
      {label ? <label className="text-sm font-medium">{label}</label> : null}
      <select value={selectedOption} onChange={handleChange} className={classSelect}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
