import React, { useState, useEffect } from "react";
import TableHeader from "@/components/molecules/TableHeader";
import DataTable from "@/components/molecules/DataTable";
import ContactForm from "@/components/organisms/ContactForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import { teamService } from "@/services/api/teamService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [contactsData, companiesData, teamData] = await Promise.all([
        contactService.getAll(),
        companyService.getAll(),
        teamService.getAll()
      ]);
      
      setContacts(contactsData);
      setFilteredContacts(contactsData);
      setCompanies(companiesData);
      setTeamMembers(teamData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
      );
      setFilteredContacts(filtered);
    }
  };

  const handleAdd = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleDelete = async (contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      try {
        await contactService.delete(contact.Id);
        setContacts(prev => prev.filter(c => c.Id !== contact.Id));
        setFilteredContacts(prev => prev.filter(c => c.Id !== contact.Id));
        toast.success("Contact deleted successfully");
      } catch (err) {
        toast.error("Failed to delete contact");
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingContact) {
        const updatedContact = await contactService.update(editingContact.Id, formData);
        setContacts(prev => prev.map(c => c.Id === editingContact.Id ? updatedContact : c));
        setFilteredContacts(prev => prev.map(c => c.Id === editingContact.Id ? updatedContact : c));
        toast.success("Contact updated successfully");
      } else {
        const newContact = await contactService.create(formData);
        setContacts(prev => [...prev, newContact]);
        setFilteredContacts(prev => [...prev, newContact]);
        toast.success("Contact created successfully");
      }
      setShowForm(false);
      setEditingContact(null);
    } catch (err) {
      toast.error("Failed to save contact");
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === companyId);
    return company ? company.name : "No Company";
  };

  const getOwnerName = (ownerId) => {
    const owner = teamMembers.find(m => m.Id === ownerId);
    return owner ? owner.name : "Unassigned";
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: "email",
      label: "Email",
      render: (value) => (
        <div className="text-gray-600">{value}</div>
      )
    },
    {
      key: "phone",
      label: "Phone",
      render: (value) => (
        <div className="text-gray-600">{value || "—"}</div>
      )
    },
    {
      key: "companyId",
      label: "Company",
      render: (value) => (
        <div className="text-gray-600">{getCompanyName(value)}</div>
      )
    },
    {
      key: "ownerId",
      label: "Owner",
      render: (value) => (
        <div className="text-gray-600">{getOwnerName(value)}</div>
      )
    },
    {
      key: "tags",
      label: "Tags",
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value && value.length > 0 ? (
            value.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-gray-400">—</span>
          )}
          {value && value.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{value.length - 2}
            </Badge>
          )}
        </div>
      )
    },
    {
      key: "lastActivity",
      label: "Last Activity",
      render: (value) => (
        <div className="text-gray-500 text-sm">
          {value ? format(new Date(value), "MMM dd, yyyy") : "—"}
        </div>
      )
    }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  if (showForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <ContactForm
          contact={editingContact}
          companies={companies}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div>
      <TableHeader
        title="Contacts"
        onSearch={handleSearch}
        onAdd={handleAdd}
        addButtonText="Add Contact"
      />

      {filteredContacts.length === 0 ? (
        <Empty
          title="No contacts found"
          description="Start building your customer relationships by adding your first contact."
          actionText="Add Contact"
          onAction={handleAdd}
          icon="Users"
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredContacts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Contacts;