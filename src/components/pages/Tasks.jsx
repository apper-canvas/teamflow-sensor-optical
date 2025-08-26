import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DataTable from "@/components/molecules/DataTable";
import TableHeader from "@/components/molecules/TableHeader";
import TaskForm from "@/components/organisms/TaskForm";
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ProviderIcon";
import { taskService } from "@/services/api/taskService";
import { teamService } from "@/services/api/teamService";
import { format, isAfter } from "date-fns";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, teamData] = await Promise.all([
        taskService.getAll(),
        teamService.getAll()
      ]);
      setTasks(tasksData);
      setTeamMembers(teamData);
      setFilteredTasks(tasksData);
    } catch (err) {
      setError("Failed to load tasks");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = tasks.filter(task =>
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  const handleFilter = (filterValue) => {
    if (filterValue === 'all') {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter(task => task.status === filterValue || task.priority === filterValue);
      setFilteredTasks(filtered);
    }
  };

  const handleAdd = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      const success = await taskService.delete(task.Id);
      if (success) {
        toast.success("Task deleted successfully");
        await loadTasks();
      }
    }
  };

  const handleFormSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.update(editingTask.Id, taskData);
        toast.success("Task updated successfully");
      } else {
        await taskService.create(taskData);
        toast.success("Task created successfully");
      }
      setShowForm(false);
      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return 'bg-gray-200 text-gray-700';
      case 'In Progress': return 'bg-blue-200 text-blue-700';
      case 'Done': return 'bg-green-200 text-green-700';
      case 'Blocked': return 'bg-red-200 text-red-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500 text-white';
      case 'High': return 'bg-orange-200 text-orange-700';
      case 'Medium': return 'bg-yellow-200 text-yellow-700';
      case 'Low': return 'bg-green-200 text-green-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getTeamMemberName = (memberId) => {
    const member = teamMembers.find(m => m.Id === memberId);
    return member ? member.name : 'Unassigned';
  };

  const isOverdue = (dueDate) => {
    return dueDate && isAfter(new Date(), new Date(dueDate));
  };

  const columns = [
    {
      key: 'title',
      label: 'Task Title',
      render: (value, task) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{value}</span>
          {task.description && (
            <span className="text-sm text-gray-500 truncate max-w-xs">
              {task.description}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value) => (
        <Badge className={getPriorityColor(value)}>
          {value}
        </Badge>
      )
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (value) => getTeamMemberName(value)
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (value, task) => (
        <div className="flex items-center gap-2">
          <span className={isOverdue(value) ? 'text-red-600 font-medium' : 'text-gray-900'}>
            {value ? format(new Date(value), 'MMM dd, yyyy') : '-'}
          </span>
          {isOverdue(value) && (
            <ApperIcon name="AlertTriangle" className="h-4 w-4 text-red-500" />
          )}
        </div>
      )
    },
    {
      key: 'estimatedHours',
      label: 'Hours',
      render: (value, task) => (
        <span className="text-sm text-gray-600">
          {task.actualHours || 0}/{value || 0}h
        </span>
      )
    }
  ];

  const filterOptions = [
    { label: 'All Tasks', value: 'all' },
    { label: 'To Do', value: 'To Do' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Done', value: 'Done' },
    { label: 'Blocked', value: 'Blocked' },
    { label: 'Critical Priority', value: 'Critical' },
    { label: 'High Priority', value: 'High' }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <div className="space-y-6">
      <TableHeader
        title="Tasks"
        onSearch={handleSearch}
        onAdd={handleAdd}
        addButtonText="Add Task"
        filterOptions={filterOptions}
        onFilter={handleFilter}
      />

      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          description="Create your first task to get started with project management."
          actionText="Add Task"
          onAction={handleAdd}
          icon="CheckSquare"
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredTasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <TaskForm
          task={editingTask}
          teamMembers={teamMembers}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default Tasks;