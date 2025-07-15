import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import { activityService } from "@/services/api/activityService";
import { teamService } from "@/services/api/teamService";
import { format } from "date-fns";

const Dashboard = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activities, setActivities] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [dealsData, contactsData, companiesData, activitiesData, teamData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        companyService.getAll(),
        activityService.getAll(),
        teamService.getAll()
      ]);
      
      setDeals(dealsData);
      setContacts(contactsData);
      setCompanies(companiesData);
      setActivities(activitiesData.slice(0, 5)); // Show only recent 5 activities
      setTeamMembers(teamData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = deals.filter(deal => deal.stage === "Won");
  const totalWonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
  const pipelineDeals = deals.filter(deal => !["Won", "Lost"].includes(deal.stage));
  const totalPipelineValue = pipelineDeals.reduce((sum, deal) => sum + deal.value, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      call: "Phone",
      email: "Mail",
      meeting: "Calendar",
      deal_won: "Trophy",
      contact_created: "UserPlus",
      default: "Activity"
    };
    return iconMap[type] || iconMap.default;
  };

  const getUserName = (userId) => {
    const user = teamMembers.find(m => m.Id === userId);
    return user ? user.name : "Unknown User";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <div className="text-sm text-gray-500">
          {format(new Date(), "EEEE, MMMM do, yyyy")}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Pipeline</p>
              <p className="text-3xl font-bold">{formatCurrency(totalDealValue)}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Won Deals</p>
              <p className="text-3xl font-bold">{formatCurrency(totalWonValue)}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Trophy" className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Active Pipeline</p>
              <p className="text-3xl font-bold">{formatCurrency(totalPipelineValue)}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm font-medium">Total Contacts</p>
              <p className="text-3xl font-bold">{contacts.length}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Overview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Overview</h3>
          <div className="space-y-4">
            {["Lead", "Qualified", "Proposal", "Won", "Lost"].map((stage) => {
              const stageDeals = deals.filter(deal => deal.stage === stage);
              const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
              const percentage = totalDealValue > 0 ? (stageValue / totalDealValue) * 100 : 0;
              
              const stageColors = {
                Lead: "bg-gray-200 text-gray-800",
                Qualified: "bg-blue-200 text-blue-800",
                Proposal: "bg-yellow-200 text-yellow-800",
                Won: "bg-green-200 text-green-800",
                Lost: "bg-red-200 text-red-800"
              };

              return (
                <div key={stage} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={stageColors[stage]}>
                      {stage}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {stageDeals.length} deals
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(stageValue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.Id} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <ApperIcon name={getActivityIcon(activity.type)} className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">
                    {getUserName(activity.userId)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(activity.timestamp), "MMM dd, h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Building2" className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{companies.length}</h3>
          <p className="text-sm text-gray-600">Total Companies</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="CheckCircle" className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{wonDeals.length}</h3>
          <p className="text-sm text-gray-600">Deals Won</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Activity" className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{pipelineDeals.length}</h3>
          <p className="text-sm text-gray-600">Active Deals</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;