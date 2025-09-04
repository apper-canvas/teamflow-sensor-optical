import React from 'react';

const Dashboard = ({ activities = [], users = [] }) => {
  const getUserName = (userId) => {
    const user = users.find(u => u?.id === userId);
    return user?.name || 'Unknown User';
  };

  return (
    <div className="dashboard">
      {activities.map((activity, index) => (
        <div key={activity?.id || index} className="activity-item">
          <p className="text-sm text-gray-900 font-medium">
            {getUserName(activity?.user_id)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;