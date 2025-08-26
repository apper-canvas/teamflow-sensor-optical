import { toast } from "react-toastify";

const tableName = 'task';

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
          { "field": { "Name": "title" } },
          { "field": { "Name": "description" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "priority" } },
          { "field": { "Name": "due_date" } },
          { "field": { "Name": "assigned_to" } },
          { "field": { "Name": "related_entity_type" } },
          { "field": { "Name": "related_entity_id" } },
          { "field": { "Name": "estimated_hours" } },
          { "field": { "Name": "actual_hours" } },
          { "field": { "Name": "created_at" } },
          { "field": { "Name": "updated_at" } }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to component expected format
      return (response.data || []).map(task => ({
        ...task,
        name: task.Name,
        assignedTo: task.assigned_to,
        dueDate: task.due_date,
        relatedEntityType: task.related_entity_type,
        relatedEntityId: task.related_entity_id,
        estimatedHours: task.estimated_hours,
        actualHours: task.actual_hours,
        createdAt: task.created_at,
        updatedAt: task.updated_at
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
          { "field": { "Name": "title" } },
          { "field": { "Name": "description" } },
          { "field": { "Name": "status" } },
          { "field": { "Name": "priority" } },
          { "field": { "Name": "due_date" } },
          { "field": { "Name": "assigned_to" } },
          { "field": { "Name": "related_entity_type" } },
          { "field": { "Name": "related_entity_id" } },
          { "field": { "Name": "estimated_hours" } },
          { "field": { "Name": "actual_hours" } },
          { "field": { "Name": "created_at" } },
          { "field": { "Name": "updated_at" } }
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
        name: task.Name,
        assignedTo: task.assigned_to,
        dueDate: task.due_date,
        relatedEntityType: task.related_entity_type,
        relatedEntityId: task.related_entity_id,
        estimatedHours: task.estimated_hours,
        actualHours: task.actual_hours,
        createdAt: task.created_at,
        updatedAt: task.updated_at
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
      
      // Only include Updateable fields, map form data to database fields
      const createData = {
        Name: taskData.title,
        Tags: taskData.tags || '',
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'To Do',
        priority: taskData.priority || 'Medium',
        due_date: taskData.dueDate,
        assigned_to: taskData.assignedTo,
        related_entity_type: taskData.relatedEntityType || '',
        related_entity_id: taskData.relatedEntityId || null,
        estimated_hours: parseFloat(taskData.estimatedHours) || 0,
        actual_hours: parseFloat(taskData.actualHours) || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
            name: task.Name,
            assignedTo: task.assigned_to,
            dueDate: task.due_date,
            relatedEntityType: task.related_entity_type,
            relatedEntityId: task.related_entity_id,
            estimatedHours: task.estimated_hours,
            actualHours: task.actual_hours,
            createdAt: task.created_at,
            updatedAt: task.updated_at
          };
        }
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
      
      // Only include Updateable fields, map form data to database fields
      const updateData = {
        Id: parseInt(id),
        Name: taskData.title || taskData.Name,
        Tags: taskData.tags || '',
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status,
        priority: taskData.priority,
        due_date: taskData.dueDate,
        assigned_to: taskData.assignedTo,
        related_entity_type: taskData.relatedEntityType || '',
        related_entity_id: taskData.relatedEntityId || null,
        estimated_hours: parseFloat(taskData.estimatedHours) || 0,
        actual_hours: parseFloat(taskData.actualHours) || 0,
        updated_at: new Date().toISOString()
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
            name: task.Name,
            assignedTo: task.assigned_to,
            dueDate: task.due_date,
            relatedEntityType: task.related_entity_type,
            relatedEntityId: task.related_entity_id,
            estimatedHours: task.estimated_hours,
            actualHours: task.actual_hours,
            createdAt: task.created_at,
            updatedAt: task.updated_at
          };
        }
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
      
      const updateData = {
        Id: parseInt(id),
        status: newStatus,
        updated_at: new Date().toISOString()
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
            name: task.Name,
            assignedTo: task.assigned_to,
            dueDate: task.due_date,
            relatedEntityType: task.related_entity_type,
            relatedEntityId: task.related_entity_id,
            estimatedHours: task.estimated_hours,
            actualHours: task.actual_hours,
            createdAt: task.created_at,
            updatedAt: task.updated_at
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