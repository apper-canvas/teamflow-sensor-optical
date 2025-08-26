import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ProviderIcon";

const TaskForm = ({ task, teamMembers = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '',
    assignedTo: '',
    relatedEntityType: '',
    relatedEntityId: '',
    estimatedHours: '',
    actualHours: '0'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'To Do',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assignedTo: task.assignedTo || '',
        relatedEntityType: task.relatedEntityType || '',
        relatedEntityId: task.relatedEntityId || '',
        estimatedHours: task.estimatedHours || '',
        actualHours: task.actualHours || '0'
      });
    }
  }, [task]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please assign this task to a team member';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (formData.estimatedHours && isNaN(formData.estimatedHours)) {
      newErrors.estimatedHours = 'Estimated hours must be a number';
    }

    if (formData.actualHours && isNaN(formData.actualHours)) {
      newErrors.actualHours = 'Actual hours must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        assignedTo: parseInt(formData.assignedTo),
        relatedEntityId: formData.relatedEntityId ? parseInt(formData.relatedEntityId) : null,
        estimatedHours: parseFloat(formData.estimatedHours) || 0,
        actualHours: parseFloat(formData.actualHours) || 0,
        dueDate: formData.dueDate ? `${formData.dueDate}T23:59:59Z` : null
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: 'To Do', label: 'To Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Done', label: 'Done' },
    { value: 'Blocked', label: 'Blocked' }
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' }
  ];

  const relatedEntityOptions = [
    { value: '', label: 'None' },
    { value: 'deal', label: 'Deal' },
    { value: 'contact', label: 'Contact' },
    { value: 'company', label: 'Company' },
    { value: 'team', label: 'Team' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {task ? 'Edit Task' : 'Add New Task'}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter task title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter task description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To *
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.assignedTo ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select team member</option>
                {teamMembers.map(member => (
                  <option key={member.Id} value={member.Id}>
                    {member.name}
                  </option>
                ))}
              </select>
              {errors.assignedTo && (
                <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className={errors.dueDate ? 'border-red-500' : ''}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
              )}
            </div>

            {/* Related Entity Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related To
              </label>
              <select
                value={formData.relatedEntityType}
                onChange={(e) => handleInputChange('relatedEntityType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {relatedEntityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Related Entity ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related Entity ID
              </label>
              <Input
                type="number"
                value={formData.relatedEntityId}
                onChange={(e) => handleInputChange('relatedEntityId', e.target.value)}
                placeholder="Enter ID (optional)"
              />
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Hours
              </label>
              <Input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                placeholder="0"
                min="0"
                step="0.5"
                className={errors.estimatedHours ? 'border-red-500' : ''}
              />
              {errors.estimatedHours && (
                <p className="text-red-500 text-sm mt-1">{errors.estimatedHours}</p>
              )}
            </div>

            {/* Actual Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual Hours
              </label>
              <Input
                type="number"
                value={formData.actualHours}
                onChange={(e) => handleInputChange('actualHours', e.target.value)}
                placeholder="0"
                min="0"
                step="0.5"
                className={errors.actualHours ? 'border-red-500' : ''}
              />
              {errors.actualHours && (
                <p className="text-red-500 text-sm mt-1">{errors.actualHours}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting && <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />}
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TaskForm;