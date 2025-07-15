import React, { useState, useEffect } from "react";
import TableHeader from "@/components/molecules/TableHeader";
import DealKanban from "@/components/organisms/DealKanban";
import DealForm from "@/components/organisms/DealForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import { teamService } from "@/services/api/teamService";
import { toast } from "react-toastify";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" or "table"

  const loadDeals = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [dealsData, contactsData, companiesData, teamData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        companyService.getAll(),
        teamService.getAll()
      ]);
      
      setDeals(dealsData);
      setFilteredDeals(dealsData);
      setContacts(contactsData);
      setCompanies(companiesData);
      setTeamMembers(teamData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredDeals(deals);
    } else {
      const filtered = deals.filter(deal =>
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.stage.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDeals(filtered);
    }
  };

  const handleFilter = (filter) => {
    if (!filter) {
      setFilteredDeals(deals);
    } else {
      const filtered = deals.filter(deal => deal.stage === filter.value);
      setFilteredDeals(filtered);
    }
  };

  const handleAdd = () => {
    setEditingDeal(null);
    setShowForm(true);
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setShowForm(true);
  };

  const handleDealUpdate = async (dealId, updateData) => {
    try {
      const updatedDeal = await dealService.update(dealId, updateData);
      setDeals(prev => prev.map(d => d.Id === dealId ? updatedDeal : d));
      setFilteredDeals(prev => prev.map(d => d.Id === dealId ? updatedDeal : d));
      toast.success("Deal updated successfully");
    } catch (err) {
      toast.error("Failed to update deal");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingDeal) {
        const updatedDeal = await dealService.update(editingDeal.Id, formData);
        setDeals(prev => prev.map(d => d.Id === editingDeal.Id ? updatedDeal : d));
        setFilteredDeals(prev => prev.map(d => d.Id === editingDeal.Id ? updatedDeal : d));
        toast.success("Deal updated successfully");
      } else {
        const newDeal = await dealService.create(formData);
        setDeals(prev => [...prev, newDeal]);
        setFilteredDeals(prev => [...prev, newDeal]);
        toast.success("Deal created successfully");
      }
      setShowForm(false);
      setEditingDeal(null);
    } catch (err) {
      toast.error("Failed to save deal");
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingDeal(null);
  };

  const filterOptions = [
    { label: "Lead", value: "Lead" },
    { label: "Qualified", value: "Qualified" },
    { label: "Proposal", value: "Proposal" },
    { label: "Won", value: "Won" },
    { label: "Lost", value: "Lost" }
  ];

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDeals} />;

  if (showForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <DealForm
          deal={editingDeal}
          contacts={contacts}
          companies={companies}
          teamMembers={teamMembers}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Deals Pipeline
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "kanban" ? "primary" : "secondary"}
              onClick={() => setViewMode("kanban")}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Columns" className="h-4 w-4" />
              Kanban
            </Button>
          </div>
          
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <ApperIcon name="Plus" className="h-4 w-4" />
            Add Deal
          </Button>
        </div>
      </div>

      {filteredDeals.length === 0 ? (
        <Empty
          title="No deals found"
          description="Start building your sales pipeline by adding your first deal."
          actionText="Add Deal"
          onAction={handleAdd}
          icon="Target"
        />
      ) : (
        <DealKanban
          deals={filteredDeals}
          onDealUpdate={handleDealUpdate}
          onDealEdit={handleEdit}
          teamMembers={teamMembers}
        />
      )}
    </div>
  );
};

export default Deals;