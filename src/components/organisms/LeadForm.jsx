import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const LeadForm = ({ lead, companies = [], contacts = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    Name: "",
    Tags: "",
    contact_information_c: "",
    project_details_c: "",
    status_c: "New",
    company_id_c: "",
    app_contact_id_c: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (lead) {
      setFormData({
        Name: lead.Name || "",
        Tags: lead.Tags || "",
        contact_information_c: lead.contact_information_c || "",
        project_details_c: lead.project_details_c || "",
        status_c: lead.status_c || "New",
        company_id_c: lead.company_id_c?.Id || lead.company_id_c || "",
        app_contact_id_c: lead.app_contact_id_c?.Id || lead.app_contact_id_c || ""
      });
    }
  }, [lead]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = "Lead name is required";
    }
    
    if (!formData.contact_information_c.trim()) {
      newErrors.contact_information_c = "Contact information is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const statusOptions = [
    { value: "New", label: "New" },
    { value: "In Progress", label: "In Progress" },
    { value: "Qualified", label: "Qualified" },
    { value: "On Hold", label: "On Hold" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Completed", label: "Completed" }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="UserPlus" className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {lead ? "Edit Lead" : "New Lead"}
            </h2>
            <p className="text-sm text-gray-500">
              {lead ? "Update lead information" : "Add a new lead to your pipeline"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lead Name *
            </label>
            <Input
              type="text"
              value={formData.Name}
              onChange={(e) => handleInputChange("Name", e.target.value)}
              placeholder="Enter lead name"
              className={errors.Name ? "border-red-300 focus:border-red-500" : ""}
            />
            {errors.Name && (
              <p className="mt-1 text-sm text-red-600">{errors.Name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status_c}
              onChange={(e) => handleInputChange("status_c", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Information *
            </label>
            <Input
              type="text"
              value={formData.contact_information_c}
              onChange={(e) => handleInputChange("contact_information_c", e.target.value)}
              placeholder="Phone, email, or other contact details"
              className={errors.contact_information_c ? "border-red-300 focus:border-red-500" : ""}
            />
            {errors.contact_information_c && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_information_c}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <Input
              type="text"
              value={formData.Tags}
              onChange={(e) => handleInputChange("Tags", e.target.value)}
              placeholder="Add tags separated by commas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <select
              value={formData.company_id_c}
              onChange={(e) => handleInputChange("company_id_c", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select a company</option>
              {companies.map(company => (
                <option key={company.Id} value={company.Id}>
                  {company.Name || company.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact
            </label>
            <select
              value={formData.app_contact_id_c}
              onChange={(e) => handleInputChange("app_contact_id_c", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select a contact</option>
              {contacts.map(contact => (
                <option key={contact.Id} value={contact.Id}>
                  {contact.Name || contact.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Details
          </label>
          <textarea
            value={formData.project_details_c}
            onChange={(e) => handleInputChange("project_details_c", e.target.value)}
            placeholder="Describe the project requirements and details"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {lead ? "Update Lead" : "Create Lead"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default LeadForm;