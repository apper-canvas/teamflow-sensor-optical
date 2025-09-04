import { toast } from "react-toastify";
import React from "react";

const tableName = 'task_c';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const params = {
fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "description_c" } },
          { "field": { "Name": "status_c" } },
          { "field": { "Name": "due_date_c" } },
          { "field": { "Name": "assignee_c" } },
          { "field": { "Name": "priority_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
return (response.data || []).map(task => ({
        ...task,
        title: task.Name,
        description: task.description_c,
        status: task.status_c,
        priority: task.priority_c,
        dueDate: task.due_date_c,
        assignedTo: task.assignee_c?.Id || task.assignee_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      
const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "description_c" } },
          { "field": { "Name": "status_c" } },
          { "field": { "Name": "due_date_c" } },
          { "field": { "Name": "assignee_c" } },
          { "field": { "Name": "priority_c" } }
        ]
      };
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      // Map database fields to component expected format
const task = response.data;
      return {
        ...task,
        title: task.Name,
        description: task.description_c,
        status: task.status_c,
        priority: task.priority_c,
        dueDate: task.due_date_c,
        assignedTo: task.assignee_c?.Id || task.assignee_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(taskData) {
    try {
      await delay(400);
      const apperClient = getApperClient();
      
// Only include Updateable fields
      const createData = {
        Name: taskData.title,
        Tags: taskData.tags || '',
        description_c: taskData.description || '',
        status_c: taskData.status || 'New',
        priority_c: taskData.priority || 'Medium',
        due_date_c: taskData.dueDate,
        assignee_c: taskData.assignedTo ? parseInt(taskData.assignedTo) : null
      };
      
      const params = {
        records: [createData]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
const task = successfulRecords[0].data;
          return {
            ...task,
            title: task.Name,
            description: task.description_c,
            status: task.status_c,
            priority: task.priority_c,
            dueDate: task.due_date_c,
            assignedTo: task.assignee_c?.Id || task.assignee_c
          };
        }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, taskData) {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
// Only include Updateable fields
      const updateData = {
        Id: parseInt(id),
        Name: taskData.title || taskData.Name,
        Tags: taskData.tags || '',
        description_c: taskData.description || '',
        status_c: taskData.status,
        priority_c: taskData.priority,
        due_date_c: taskData.dueDate,
        assignee_c: taskData.assignedTo ? parseInt(taskData.assignedTo) : null
      };
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
const task = successfulRecords[0].data;
          return {
            ...task,
            title: task.Name,
            description: task.description_c,
            status: task.status_c,
            priority: task.priority_c,
            dueDate: task.due_date_c,
            assignedTo: task.assignee_c?.Id || task.assignee_c
          };
        }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      await delay(250);
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} tasks:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async updateStatus(id, newStatus) {
    try {
      await delay(200);
const apperClient = getApperClient();
      
      // Only include the status field for update
      const updateData = {
        Id: parseInt(id),
        status_c: newStatus
      };
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} task statuses:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
return {
            ...task,
            title: task.Name,
            description: task.description_c,
            status: task.status_c,
            priority: task.priority_c,
            dueDate: task.due_date_c,
            assignedTo: task.assignee_c?.Id || task.assignee_c
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
};