import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ProviderIcon";

const SearchBar = ({ placeholder = "Search...", onSearch, className }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <ApperIcon name="Search" className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        className="pl-10"
      />
    </div>
  );
};

export default SearchBar;