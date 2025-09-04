const filtered = tasks.filter(task =>
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
);

const columns = [
  {
    key: 'title',
    label: 'Task Title',
  },
  {
    key: 'assignedTo',
    label: 'Assigned To',
    render: (value) => getTeamMemberName(value)
  },
  {
    key: 'estimatedHours',
    label: 'Hours',
    render: (value, task) => (
      <span>{value || 0}</span>
    )
  }
];