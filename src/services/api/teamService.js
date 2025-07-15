import teamMembersData from "@/services/mockData/teamMembers.json";

let teamMembers = [...teamMembersData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const teamService = {
  async getAll() {
    await delay(300);
    return [...teamMembers];
  },

  async getById(id) {
    await delay(200);
    const member = teamMembers.find(m => m.Id === parseInt(id));
    if (!member) {
      throw new Error("Team member not found");
    }
    return { ...member };
  }
};