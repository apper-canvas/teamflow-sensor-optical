import { toast } from "react-toastify";

const tableName = 'app_contact';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contactService = {
  async getAll() {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "email" } },
          { "field": { "Name": "phone" } },
          { "field": { "Name": "company_id" } },
          { "field": { "Name": "owner_id" } },
          { "field": { "Name": "created_at" } },
          { "field": { "Name": "last_activity" } }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to component expected format
      return (response.data || []).map(contact => ({
        ...contact,
        name: contact.Name,
        tags: contact.Tags ? contact.Tags.split(',').map(tag => tag.trim()) : [],
        companyId: contact.company_id,
        ownerId: contact.owner_id,
        createdAt: contact.created_at,
        lastActivity: contact.last_activity
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching contacts:", error?.response?.data?.message);
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
          { "field": { "Name": "email" } },
          { "field": { "Name": "phone" } },
          { "field": { "Name": "company_id" } },
          { "field": { "Name": "owner_id" } },
          { "field": { "Name": "created_at" } },
          { "field": { "Name": "last_activity" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      // Map database fields to component expected format
      const contact = response.data;
      return {
        ...contact,
        name: contact.Name,
        tags: contact.Tags ? contact.Tags.split(',').map(tag => tag.trim()) : [],
        companyId: contact.company_id,
        ownerId: contact.owner_id,
        createdAt: contact.created_at,
        lastActivity: contact.last_activity
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching contact with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(contactData) {
    try {
      await delay(400);
      const apperClient = getApperClient();
      
      // Only include Updateable fields, map form data to database fields
      const createData = {
        Name: contactData.name,
        Tags: Array.isArray(contactData.tags) ? contactData.tags.join(',') : contactData.tags || '',
        email: contactData.email,
        phone: contactData.phone,
        company_id: contactData.companyId,
        owner_id: contactData.ownerId,
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString()
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
          console.error(`Failed to create ${failedRecords.length} contacts:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const contact = successfulRecords[0].data;
          return {
            ...contact,
            name: contact.Name,
            tags: contact.Tags ? contact.Tags.split(',').map(tag => tag.trim()) : [],
            companyId: contact.company_id,
            ownerId: contact.owner_id,
            createdAt: contact.created_at,
            lastActivity: contact.last_activity
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating contact:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, contactData) {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      // Only include Updateable fields, map form data to database fields
      const updateData = {
        Id: parseInt(id),
        Name: contactData.name,
        Tags: Array.isArray(contactData.tags) ? contactData.tags.join(',') : contactData.tags || '',
        email: contactData.email,
        phone: contactData.phone,
        company_id: contactData.companyId,
        owner_id: contactData.ownerId,
        last_activity: new Date().toISOString()
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
          console.error(`Failed to update ${failedRecords.length} contacts:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const contact = successfulRecords[0].data;
          return {
            ...contact,
            name: contact.Name,
            tags: contact.Tags ? contact.Tags.split(',').map(tag => tag.trim()) : [],
            companyId: contact.company_id,
            ownerId: contact.owner_id,
            createdAt: contact.created_at,
            lastActivity: contact.last_activity
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating contact:", error?.response?.data?.message);
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
          console.error(`Failed to delete ${failedDeletions.length} contacts:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting contact:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};