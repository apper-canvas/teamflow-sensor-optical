import React from "react";
import SearchBar from "@/components/molecules/SearchBar";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ProviderIcon";

const TableHeader = ({ 
  title, 
  onSearch, 
  onAdd, 
  addButtonText = "Add", 
  filterOptions = [],
  onFilter 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
        {title}
      </h1>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <SearchBar 
          onSearch={onSearch}
          className="w-full sm:w-64"
          placeholder={`Search ${title.toLowerCase()}...`}
        />
        
        {filterOptions.length > 0 && (
          <FilterDropdown 
            options={filterOptions}
            onFilter={onFilter}
          />
        )}
        
        {onAdd && (
          <Button onClick={onAdd} className="flex items-center gap-2">
            <ApperIcon name="Plus" className="h-4 w-4" />
            {addButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableHeader;