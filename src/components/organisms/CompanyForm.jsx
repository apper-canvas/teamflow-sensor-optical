import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";

const CompanyForm = ({ company, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    name: company?.name || "",
    industry: company?.industry || "",
    size: company?.size || "",
    website: company?.website || "",
    tags: company?.tags || ""
  });

  const [errors, setErrors] = useState({});

  const companySizes = [
    "Small (1-10 employees)",
    "Small (10-50 employees)",
    "Medium (50-100 employees)",
    "Medium (100-500 employees)",
    "Enterprise (500+ employees)",
    "Enterprise (1000+ employees)"
  ];

  const industries = [
    "Technology",
    "Software",
    "Healthcare",
    "Finance",
    "Marketing",
    "Consulting",
    "Manufacturing",
    "Retail",
    "Education",
    "Other"
  ];

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
      newErrors.name = "Company name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
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
            <ApperIcon name="Building2" className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
            {company ? "Edit Company" : "Add New Company"}
        </h2>
    </div>
    <form onSubmit={handleSubmit} className="space-y-4">
        <Input
            label="Company Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter company name" />
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry
                          </label>
            <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">Select an industry</option>
                {industries.map(industry => <option key={industry} value={industry}>
                    {industry}
                </option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Size
                          </label>
            <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">Select company size</option>
                {companySizes.map(size => <option key={size} value={size}>
                    {size}
                </option>)}
            </select>
        </div>
        <Input
            label="Website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://company.com" />
        <Input
            label="Tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Enter tags separated by commas" />
        <div className="flex gap-3 pt-4">
            <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                    {company ? "Update Company" : "Add Company"}
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel
                              </Button>
            </div>
        </div></form>
</Card>
  );
};

export default CompanyForm;