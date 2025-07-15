import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";

const DealForm = ({ deal, contacts = [], companies = [], teamMembers = [], onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    title: deal?.title || "",
    value: deal?.value || "",
    stage: deal?.stage || "Lead",
    contactId: deal?.contactId || "",
    companyId: deal?.companyId || "",
    ownerId: deal?.ownerId || "",
    probability: deal?.probability || "",
    closeDate: deal?.closeDate ? deal.closeDate.split("T")[0] : "",
    tags: deal?.tags || ""
  });

  const [errors, setErrors] = useState({});

  const stages = ["Lead", "Qualified", "Proposal", "Won", "Lost"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Value must be greater than 0";
    }

    if (!formData.closeDate) {
      newErrors.closeDate = "Close date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        value: parseFloat(formData.value),
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        companyId: formData.companyId ? parseInt(formData.companyId) : null,
        ownerId: formData.ownerId ? parseInt(formData.ownerId) : null,
        probability: formData.probability ? parseInt(formData.probability) : 0,
        closeDate: formData.closeDate,
        tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).join(",") : ""
      };
      onSubmit(submitData);
    }
  };
  return (
    <Card className="p-6 max-w-md mx-auto">
    <div className="flex items-center gap-3 mb-6">
        <div
            className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Target" className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
            {deal ? "Edit Deal" : "Add New Deal"}
        </h2>
    </div>
    <form onSubmit={handleSubmit} className="space-y-4">
        <Input
            label="Deal Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Enter deal title" />
        <Input
            label="Deal Value"
            name="value"
            type="number"
            value={formData.value}
            onChange={handleChange}
            error={errors.value}
            placeholder="Enter deal value" />
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stage
                          </label>
            <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                {stages.map(stage => <option key={stage} value={stage}>
                    {stage}
                </option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact
                          </label>
            <select
                name="contactId"
                value={formData.contactId}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">Select a contact</option>
                {contacts.map(contact => <option key={contact.Id} value={contact.Id}>
                    {contact.name}
                </option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company
                          </label>
            <select
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">Select a company</option>
                {companies.map(company => <option key={company.Id} value={company.Id}>
                    {company.name}
                </option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Owner
                          </label>
            <select
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">Select an owner</option>
                {teamMembers.map(member => <option key={member.Id} value={member.Id}>
                    {member.name}
                </option>)}
            </select>
        </div>
        <Input
            label="Probability (%)"
            name="probability"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={handleChange}
            placeholder="Enter probability percentage" />
        <Input
            label="Close Date"
            name="closeDate"
            type="date"
            value={formData.closeDate}
            onChange={handleChange}
            error={errors.closeDate} />
        <Input
            label="Tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Enter tags separated by commas" />
<div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
                {deal ? "Update Deal" : "Add Deal"}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel
            </Button>
        </div>
      </form>
    </Card>
  );
};

export default DealForm;