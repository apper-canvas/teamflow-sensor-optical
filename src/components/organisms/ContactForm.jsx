import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";

const ContactForm = ({ contact, companies = [], onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    name: contact?.name || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    companyId: contact?.companyId || "",
    ownerId: contact?.ownerId || "",
    tags: contact?.tags?.join(", ") || ""
  });

  const [errors, setErrors] = useState({});

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
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        companyId: formData.companyId ? parseInt(formData.companyId) : null,
        ownerId: formData.ownerId ? parseInt(formData.ownerId) : null,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
      };
      onSubmit(submitData);
    }
  };
  return (
    <Card className="p-6 max-w-md mx-auto">
    <div className="flex items-center gap-3 mb-6">
        <div
            className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="User" className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
            {contact ? "Edit Contact" : "Add New Contact"}
        </h2>
    </div>
    <form onSubmit={handleSubmit} className="space-y-4">
        <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter full name" />
        <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter email address" />
        <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number" />
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
                {companies.map(company => <option key={company.Id} value={company.Id}>
                    {company.name}
                </option>)}
            </select>
        </div>
        <Input
            label="Tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Enter tags separated by commas" />
<div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
                {contact ? "Update Contact" : "Add Contact"}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
            </Button>
        </div>
      </form>
    </Card>
  );
};

export default ContactForm;