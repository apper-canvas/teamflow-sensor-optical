import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from "@/components/ProviderIcon";
import { teamService } from '@/services/api/teamService';
import { activityService } from '@/services/api/activityService';
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeamData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [teamData, activitiesData, dealsData, contactsData] = await Promise.all([
        teamService.getAll(),
        activityService.getAll(),
        dealService.getAll(),
        contactService.getAll()
      ]);
      
      setTeamMembers(teamData);
      setActivities(activitiesData);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeamData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadTeamData} />;

  const getMemberStats = (memberId) => {
    const memberDeals = deals.filter(d => d.ownerId === memberId);
    const memberContacts = contacts.filter(c => c.ownerId === memberId);
    const wonDeals = memberDeals.filter(d => d.stage === "Won");
    const totalValue = memberDeals.reduce((sum, deal) => sum + deal.value, 0);
    const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);

    return {
      totalDeals: memberDeals.length,
      totalContacts: memberContacts.length,
      wonDeals: wonDeals.length,
      totalValue,
      wonValue
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRoleColor = (role) => {
    const roleColors = {
      "Sales Manager": "bg-purple-100 text-purple-800",
      "Sales Representative": "bg-blue-100 text-blue-800",
      "Business Development": "bg-green-100 text-green-800",
      default: "bg-gray-100 text-gray-800"
    };
    return roleColors[role] || roleColors.default;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Team Overview
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ApperIcon name="Users" className="h-4 w-4" />
          {teamMembers.length} team members
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => {
          const stats = getMemberStats(member.Id);
          return (
            <Card key={member.Id} className="p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-4 mb-4">
                <Avatar
                  fallback={member.name.split(" ").map(n => n[0]).join("")}
                  alt={member.name}
                  size="lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.email}</p>
                  <Badge className={`mt-1 ${getRoleColor(member.role)}`}>
                    {member.role}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Deals</span>
                  <span className="font-medium text-gray-900">{stats.totalDeals}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Won Deals</span>
                  <span className="font-medium text-green-600">{stats.wonDeals}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Contacts</span>
                  <span className="font-medium text-gray-900">{stats.totalContacts}</span>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pipeline Value</span>
                    <span className="font-bold text-primary-600">
                      {formatCurrency(stats.totalValue)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">Won Value</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(stats.wonValue)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Team Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Team Activity</h2>
            <ActivityFeed activities={activities} teamMembers={teamMembers} />
          </Card>
        </div>

        {/* Team Summary Stats */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Target" className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Team Pipeline</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-primary-100">Total Deals</span>
                <span className="font-bold">{deals.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-100">Pipeline Value</span>
                <span className="font-bold">
                  {formatCurrency(deals.reduce((sum, deal) => sum + deal.value, 0))}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Trophy" className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Won Deals</h3>
            </div>
            <div className="space-y-2">
              {(() => {
                const wonDeals = deals.filter(d => d.stage === "Won");
                const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
                return (
                  <>
                    <div className="flex justify-between">
                      <span className="text-green-100">Count</span>
                      <span className="font-bold">{wonDeals.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-100">Value</span>
                      <span className="font-bold">{formatCurrency(wonValue)}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent-500 to-pink-500 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Team Contacts</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-pink-100">Total Contacts</span>
                <span className="font-bold">{contacts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pink-100">Avg per Member</span>
                <span className="font-bold">
                  {Math.round(contacts.length / teamMembers.length)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Team;