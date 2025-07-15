import React from "react";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import { format, formatDistanceToNow } from "date-fns";

const ActivityFeed = ({ activities, teamMembers = [] }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      call: "Phone",
      email: "Mail",
      meeting: "Calendar",
      deal_won: "Trophy",
      deal_lost: "X",
      contact_created: "UserPlus",
      company_created: "Building",
      default: "Activity"
    };
    return iconMap[type] || iconMap.default;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      call: "text-blue-600 bg-blue-100",
      email: "text-purple-600 bg-purple-100",
      meeting: "text-green-600 bg-green-100",
      deal_won: "text-yellow-600 bg-yellow-100",
      deal_lost: "text-red-600 bg-red-100",
      contact_created: "text-indigo-600 bg-indigo-100",
      company_created: "text-gray-600 bg-gray-100",
      default: "text-gray-600 bg-gray-100"
    };
    return colorMap[type] || colorMap.default;
  };

  const getUserName = (userId) => {
    const user = teamMembers.find(m => m.Id === userId);
    return user ? user.name : "Unknown User";
  };

  const getUserInitials = (userId) => {
    const user = teamMembers.find(m => m.Id === userId);
    return user ? user.name.split(" ").map(n => n[0]).join("") : "U";
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.Id} className="p-4">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
              <ApperIcon name={getActivityIcon(activity.type)} className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar
                    fallback={getUserInitials(activity.userId)}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {getUserName(activity.userId)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                {activity.description}
              </p>
              
              <div className="text-xs text-gray-400 mt-1">
                {format(new Date(activity.timestamp), "MMM dd, yyyy 'at' h:mm a")}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ActivityFeed;