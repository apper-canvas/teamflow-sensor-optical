import React, { useState, useEffect } from "react";
import TableHeader from "@/components/molecules/TableHeader";
import DataTable from "@/components/molecules/DataTable";
import LeadForm from "@/components/organisms/LeadForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import { leadService } from "@/services/api/leadService";
import { companyService } from "@/services/api/companyService";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [leadsData, companiesData, contactsData] = await Promise.all([
        leadService.getAll(),
        companyService.getAll(),
        contactService.getAll()
      ]);
      
      setLeads(leadsData);
      setFilteredLeads(leadsData);
      setCompanies(companiesData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredLeads(leads);
    } else {
      const filtered = leads.filter(lead =>
        lead.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.status_c.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLeads(filtered);
    }
  };

  const handleAdd = () => {
    setEditingLead(null);
    setShowForm(true);
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDelete = async (lead) => {
    if (window.confirm(`Are you sure you want to delete lead "${lead.Name}"?`)) {
      try {
        const success = await leadService.delete(lead.Id);
        if (success) {
          setLeads(prev => prev.filter(l => l.Id !== lead.Id));
          setFilteredLeads(prev => prev.filter(l => l.Id !== lead.Id));
        }
      } catch (err) {
        toast.error("Failed to delete lead");
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingLead) {
        const updatedLead = await leadService.update(editingLead.Id, formData);
        if (updatedLead) {
          setLeads(prev => prev.map(l => l.Id === editingLead.Id ? updatedLead : l));
          setFilteredLeads(prev => prev.map(l => l.Id === editingLead.Id ? updatedLead : l));
        }
      } else {
        const newLead = await leadService.create(formData);
        if (newLead) {
          setLeads(prev => [...prev, newLead]);
          setFilteredLeads(prev => [...prev, newLead]);
        }
      }
      setShowForm(false);
      setEditingLead(null);
    } catch (err) {
      toast.error("Failed to save lead");
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingLead(null);
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === companyId);
    return company ? company.Name : "N/A";
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.Name : "N/A";
  };

  const getStatusBadgeColor = (status) => {
    const colorMap = {
      "New": "bg-blue-100 text-blue-800",
      "In Progress": "bg-yellow-100 text-yellow-800",
      "Qualified": "bg-green-100 text-green-800",
      "On Hold": "bg-gray-100 text-gray-800",
      "Cancelled": "bg-red-100 text-red-800",
      "Completed": "bg-purple-100 text-purple-800"
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  const columns = [
    {
      key: "Name",
      label: "Lead Name",
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          {row.contact_information_c && (
            <div className="text-xs text-gray-500 mt-1">
              {row.contact_information_c}
            </div>
          )}
        </div>
      )
    },
    {
      key: "status_c",
      label: "Status",
      render: (value) => (
        <Badge className={getStatusBadgeColor(value)}>
          {value || "New"}
        </Badge>
      )
    },
    {
      key: "company_id_c",
      label: "Company",
      render: (value) => (
        <div className="text-gray-600">
          {value ? getCompanyName(value.Id || value) : "N/A"}
        </div>
      )
    },
    {
      key: "app_contact_id_c",
      label: "Contact",
      render: (value) => (
        <div className="text-gray-600">
          {value ? getContactName(value.Id || value) : "N/A"}
        </div>
      )
    },
    {
      key: "project_details_c",
      label: "Project Details",
      render: (value) => (
        <div className="text-gray-600 text-sm max-w-xs truncate">
          {value || "No details provided"}
        </div>
      )
    },
    {
      key: "CreatedOn",
      label: "Created",
      render: (value) => (
        <div className="text-gray-500 text-sm">
          {value ? format(new Date(value), "MMM dd, yyyy") : "N/A"}
        </div>
      )
    }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadLeads} />;

  if (showForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <LeadForm
          lead={editingLead}
          companies={companies}
          contacts={contacts}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div>
      <TableHeader
        title="Leads"
        onSearch={handleSearch}
        onAdd={handleAdd}
        addButtonText="Add Lead"
      />

      {filteredLeads.length === 0 ? (
        <Empty
          title="No leads found"
          description="Start building your sales pipeline by adding your first lead."
          actionText="Add Lead"
          onAction={handleAdd}
          icon="UserPlus"
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredLeads}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Leads;