import { toast } from 'react-toastify';

function getApperClient() {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const leadService = {
  async getAll() {
    try {
      await delay(300);
      
      const apperClient = getApperClient();
      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "contact_information_c" } },
          { "field": { "Name": "project_details_c" } },
          { "field": { "Name": "status_c" } },
          { "field": { "Name": "company_id_c" } },
          { "field": { "Name": "app_contact_id_c" } },
          { "field": { "Name": "CreatedOn" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('lead_c', params);
      
      if (!response?.success) {
        console.error("Error fetching leads:", response?.message || "Unknown error");
        toast.error(response?.message || "Failed to fetch leads");
        return [];
      }
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching leads:", error?.response?.data?.message || error);
      toast.error("Failed to fetch leads");
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
          { "field": { "Name": "contact_information_c" } },
          { "field": { "Name": "project_details_c" } },
          { "field": { "Name": "status_c" } },
          { "field": { "Name": "company_id_c" } },
          { "field": { "Name": "app_contact_id_c" } },
          { "field": { "Name": "CreatedOn" } }
        ]
      };
      
      const response = await apperClient.getRecordById('lead_c', id, params);
      
      if (!response?.success) {
        console.error(`Error fetching lead ${id}:`, response?.message || "Unknown error");
        toast.error(response?.message || `Failed to fetch lead ${id}`);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching lead ${id}:`, error?.response?.data?.message || error);
      toast.error(`Failed to fetch lead ${id}`);
      return null;
    }
  },

  async create(leadData) {
    try {
      await delay(400);
      
      const apperClient = getApperClient();
      
      // Only include Updateable fields based on schema
      const params = {
        records: [{
          Name: leadData.Name,
          Tags: leadData.Tags || "",
          contact_information_c: leadData.contact_information_c || "",
          project_details_c: leadData.project_details_c || "",
          status_c: leadData.status_c || "New",
          company_id_c: leadData.company_id_c ? parseInt(leadData.company_id_c) : null,
          app_contact_id_c: leadData.app_contact_id_c ? parseInt(leadData.app_contact_id_c) : null
        }]
      };
      
      const response = await apperClient.createRecord('lead_c', params);
      
      if (!response.success) {
        console.error("Error creating lead:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} leads:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Lead created successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating lead:", error?.response?.data?.message || error);
      toast.error("Failed to create lead");
      return null;
    }
  },

  async update(id, leadData) {
    try {
      await delay(400);
      
      const apperClient = getApperClient();
      
      // Only include Updateable fields based on schema
      const params = {
        records: [{
          Id: parseInt(id),
          Name: leadData.Name,
          Tags: leadData.Tags || "",
          contact_information_c: leadData.contact_information_c || "",
          project_details_c: leadData.project_details_c || "",
          status_c: leadData.status_c || "New",
          company_id_c: leadData.company_id_c ? parseInt(leadData.company_id_c) : null,
          app_contact_id_c: leadData.app_contact_id_c ? parseInt(leadData.app_contact_id_c) : null
        }]
      };
      
      const response = await apperClient.updateRecord('lead_c', params);
      
      if (!response.success) {
        console.error("Error updating lead:", response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} leads:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Lead updated successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating lead:", error?.response?.data?.message || error);
      toast.error("Failed to update lead");
      return null;
    }
  },

  async delete(id) {
    try {
      await delay(300);
      
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('lead_c', params);
      
      if (!response.success) {
        console.error("Error deleting lead:", response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} leads:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Lead deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting lead:", error?.response?.data?.message || error);
      toast.error("Failed to delete lead");
      return false;
    }
  }
};