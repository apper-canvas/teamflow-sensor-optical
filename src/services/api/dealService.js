import { toast } from "react-toastify";

const tableName = 'deal';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dealService = {
  async getAll() {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "title" } },
          { "field": { "Name": "value" } },
          { "field": { "Name": "stage" } },
          { "field": { "Name": "probability" } },
          { "field": { "Name": "close_date" } },
          { "field": { "Name": "contact_id" } },
          { "field": { "Name": "company_id" } },
          { "field": { "Name": "owner_id" } },
          { "field": { "Name": "created_at" } }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to component expected format
      return (response.data || []).map(deal => ({
        ...deal,
        name: deal.Name,
        contactId: deal.contact_id,
        companyId: deal.company_id,
        ownerId: deal.owner_id,
        closeDate: deal.close_date,
        createdAt: deal.created_at
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals:", error?.response?.data?.message);
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
          { "field": { "Name": "value" } },
          { "field": { "Name": "stage" } },
          { "field": { "Name": "probability" } },
          { "field": { "Name": "close_date" } },
          { "field": { "Name": "contact_id" } },
          { "field": { "Name": "company_id" } },
          { "field": { "Name": "owner_id" } },
          { "field": { "Name": "created_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      // Map database fields to component expected format
      const deal = response.data;
      return {
        ...deal,
        name: deal.Name,
        contactId: deal.contact_id,
        companyId: deal.company_id,
        ownerId: deal.owner_id,
        closeDate: deal.close_date,
        createdAt: deal.created_at
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching deal with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(dealData) {
    try {
      await delay(400);
      const apperClient = getApperClient();
      
      // Only include Updateable fields, map form data to database fields
      const createData = {
        Name: dealData.title,
        Tags: dealData.tags || '',
        title: dealData.title,
        value: parseFloat(dealData.value),
        stage: dealData.stage,
        probability: dealData.probability ? `0-${dealData.probability}` : "0-0",
        close_date: dealData.closeDate,
        contact_id: dealData.contactId,
        company_id: dealData.companyId,
        owner_id: dealData.ownerId,
        created_at: new Date().toISOString()
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
          console.error(`Failed to create ${failedRecords.length} deals:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const deal = successfulRecords[0].data;
          return {
            ...deal,
            name: deal.Name,
            contactId: deal.contact_id,
            companyId: deal.company_id,
            ownerId: deal.owner_id,
            closeDate: deal.close_date,
            createdAt: deal.created_at
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating deal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, dealData) {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      // Only include Updateable fields, map form data to database fields
      const updateData = {
        Id: parseInt(id),
        Name: dealData.title || dealData.Name,
        Tags: dealData.tags || '',
        title: dealData.title,
        value: parseFloat(dealData.value),
        stage: dealData.stage,
        probability: dealData.probability ? `0-${dealData.probability}` : "0-0",
        close_date: dealData.closeDate,
        contact_id: dealData.contactId,
        company_id: dealData.companyId,
        owner_id: dealData.ownerId
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
          console.error(`Failed to update ${failedRecords.length} deals:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const deal = successfulRecords[0].data;
          return {
            ...deal,
            name: deal.Name,
            contactId: deal.contact_id,
            companyId: deal.company_id,
            ownerId: deal.owner_id,
            closeDate: deal.close_date,
            createdAt: deal.created_at
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating deal:", error?.response?.data?.message);
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
          console.error(`Failed to delete ${failedDeletions.length} deals:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting deal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async updateStage(id, newStage) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      
      const updateData = {
        Id: parseInt(id),
        stage: newStage
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
          console.error(`Failed to update ${failedRecords.length} deal stages:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const deal = successfulRecords[0].data;
          return {
            ...deal,
            name: deal.Name,
            contactId: deal.contact_id,
            companyId: deal.company_id,
            ownerId: deal.owner_id,
            closeDate: deal.close_date,
            createdAt: deal.created_at
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating deal stage:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
};