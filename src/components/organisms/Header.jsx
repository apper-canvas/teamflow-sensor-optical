import React, { useContext } from "react";
import { useSelector } from 'react-redux';
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "../../App";
const Header = ({ onMenuClick }) => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
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
            
            <Button variant="ghost" onClick={logout} className="p-2" title="Logout">
              <ApperIcon name="LogOut" className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <Avatar
                fallback={user?.firstName && user?.lastName ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
                alt={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "User"}
                size="md"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.emailAddress || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.accounts?.[0]?.companyName || "TeamFlow CRM"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;