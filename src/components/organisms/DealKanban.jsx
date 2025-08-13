import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ProviderIcon";
import { format } from "date-fns";

const DealKanban = ({ deals, onDealUpdate, onDealEdit, teamMembers = [] }) => {
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = [
    { id: "Lead", name: "Lead", color: "bg-gray-100 text-gray-800" },
    { id: "Qualified", name: "Qualified", color: "bg-blue-100 text-blue-800" },
    { id: "Proposal", name: "Proposal", color: "bg-yellow-100 text-yellow-800" },
    { id: "Won", name: "Won", color: "bg-green-100 text-green-800" },
    { id: "Lost", name: "Lost", color: "bg-red-100 text-red-800" }
  ];

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getOwnerName = (ownerId) => {
    const owner = teamMembers.find(m => m.Id === ownerId);
    return owner ? owner.name : "Unassigned";
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== targetStage) {
      onDealUpdate(draggedDeal.Id, { stage: targetStage });
    }
    setDraggedDeal(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageDeals = getDealsByStage(stage.id);
        const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

        return (
          <div
            key={stage.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="bg-gray-50 rounded-lg p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge className={stage.color}>
                    {stage.name}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {formatCurrency(stageValue)}
                </div>
              </div>

              <div className="space-y-3">
                {stageDeals.map((deal) => (
                  <Card
                    key={deal.Id}
                    className="kanban-card p-4 cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-gray-900 text-sm leading-tight">
                          {deal.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDealEdit(deal)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ApperIcon name="Edit" className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">
                          {formatCurrency(deal.value)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {deal.probability}%
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Calendar" className="h-3 w-3" />
                          {format(new Date(deal.closeDate), "MMM dd")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Avatar
                            fallback={getOwnerName(deal.ownerId).split(" ").map(n => n[0]).join("")}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DealKanban;