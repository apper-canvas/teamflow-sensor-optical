import React, { useState, useEffect } from "react";
import TableHeader from "@/components/molecules/TableHeader";
import DataTable from "@/components/molecules/DataTable";
import CompanyForm from "@/components/organisms/CompanyForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import { companyService } from "@/services/api/companyService";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [companiesData, contactsData, dealsData] = await Promise.all([
        companyService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      
      setCompanies(companiesData);
      setFilteredCompanies(companiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  };

  const handleAdd = () => {
    setEditingCompany(null);
    setShowForm(true);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleDelete = async (company) => {
    const companyContacts = contacts.filter(c => c.companyId === company.Id);
    const companyDeals = deals.filter(d => d.companyId === company.Id);
    
    if (companyContacts.length > 0 || companyDeals.length > 0) {
      toast.error("Cannot delete company with associated contacts or deals");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      try {
        await companyService.delete(company.Id);
        setCompanies(prev => prev.filter(c => c.Id !== company.Id));
        setFilteredCompanies(prev => prev.filter(c => c.Id !== company.Id));
        toast.success("Company deleted successfully");
      } catch (err) {
        toast.error("Failed to delete company");
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingCompany) {
        const updatedCompany = await companyService.update(editingCompany.Id, formData);
        setCompanies(prev => prev.map(c => c.Id === editingCompany.Id ? updatedCompany : c));
        setFilteredCompanies(prev => prev.map(c => c.Id === editingCompany.Id ? updatedCompany : c));
        toast.success("Company updated successfully");
      } else {
        const newCompany = await companyService.create(formData);
        setCompanies(prev => [...prev, newCompany]);
        setFilteredCompanies(prev => [...prev, newCompany]);
        toast.success("Company created successfully");
      }
      setShowForm(false);
      setEditingCompany(null);
    } catch (err) {
      toast.error("Failed to save company");
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  const getContactCount = (companyId) => {
    return contacts.filter(c => c.companyId === companyId).length;
  };

  const getDealCount = (companyId) => {
    return deals.filter(d => d.companyId === companyId).length;
  };

  const getTotalDealValue = (companyId) => {
    return deals
      .filter(d => d.companyId === companyId)
      .reduce((sum, deal) => sum + deal.value, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const columns = [
    {
      key: "name",
      label: "Company Name",
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          {row.website && (
            <a
              href={row.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              {row.website}
            </a>
          )}
        </div>
      )
    },
    {
      key: "industry",
      label: "Industry",
      render: (value) => (
        <Badge variant="secondary" className="text-xs">
          {value || "Not specified"}
        </Badge>
      )
    },
    {
      key: "size",
      label: "Company Size",
      render: (value) => (
        <div className="text-gray-600 text-sm">{value || "Not specified"}</div>
      )
    },
    {
      key: "Id",
      label: "Contacts",
      render: (value) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {getContactCount(value)}
          </span>
        </div>
      )
    },
    {
      key: "Id",
      label: "Deals",
      render: (value) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            {getDealCount(value)}
          </span>
        </div>
      )
    },
    {
      key: "Id",
      label: "Deal Value",
      render: (value) => {
        const totalValue = getTotalDealValue(value);
        return (
          <div className="text-right">
            <div className="font-medium text-gray-900">
              {formatCurrency(totalValue)}
            </div>
          </div>
        );
      }
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value) => (
        <div className="text-gray-500 text-sm">
          {format(new Date(value), "MMM dd, yyyy")}
        </div>
      )
    }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;

  if (showForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <CompanyForm
          company={editingCompany}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div>
      <TableHeader
        title="Companies"
        onSearch={handleSearch}
        onAdd={handleAdd}
        addButtonText="Add Company"
      />

      {filteredCompanies.length === 0 ? (
        <Empty
          title="No companies found"
          description="Start organizing your business relationships by adding your first company."
          actionText="Add Company"
          onAction={handleAdd}
          icon="Building2"
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredCompanies}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Companies;