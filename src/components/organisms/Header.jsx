import React from "react";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuClick }) => {
  return (
    <div className="lg:pl-64">
      <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:border-none">
        <button
          type="button"
          className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
          onClick={onMenuClick}
        >
          <ApperIcon name="Menu" className="h-6 w-6" />
        </button>
        
        <div className="flex-1 px-4 flex justify-between items-center">
          <div className="flex-1 flex">
            {/* Search could go here in the future */}
          </div>
          
          <div className="ml-4 flex items-center gap-4">
            <Button variant="ghost" className="p-2">
              <ApperIcon name="Bell" className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <Avatar
                fallback="JD"
                alt="John Doe"
                size="md"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
                <p className="text-xs text-gray-500">Sales Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;