import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Project } from '@/types';
import { api } from '@/services/api';

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([]);
  const isLoading = ref(false);

  async function fetchProjects() {
    isLoading.value = true;

    try {
      const response = await api.get('/projects');
      projects.value = response.data;

      // Кэшируем для офлайн-использования
      localStorage.setItem('projects', JSON.stringify(projects.value));
    } catch (err) {
      // Пытаемся загрузить из локального хранилища
      const localProjects = localStorage.getItem('projects');
      if (localProjects) {
        projects.value = JSON.parse(localProjects);
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function addProject(
    name: string,
    color: string = '#3498db',
    description: string
  ) {
    const newProject = {
      id: Date.now(),
      name,
      color,
      synced: false,
      description,
    };

    projects.value.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects.value));

    try {
      const response = await api.post('/projects', newProject);
      // Обновляем ID если сервер возвратил новый
      const index = projects.value.findIndex((p) => p.id === newProject.id);
      if (index !== -1) {
        projects.value[index].id = response.data.id;
        projects.value[index].synced = true;
      }
    } catch (err) {
      console.error('Failed to sync project:', err);
    }
  }

  async function deleteProject(id: number) {
    // Remove the project from the local store
    projects.value = projects.value.filter((project) => project.id !== id);
    localStorage.setItem('projects', JSON.stringify(projects.value));

    try {
      // Delete the project on the server
      await api.delete(`/projects/${id}`);
    } catch (err) {
      console.error('Failed to delete project on server:', err);
    }
  }

  async function updateProject(updatedProject: Partial<Project> & { id: number }) {
    const index = projects.value.findIndex((p) => p.id === updatedProject.id);
    if (index === -1) return;

    // Update the local project data and mark as not synced
    projects.value[index] = { ...projects.value[index], ...updatedProject, synced: false };
    localStorage.setItem('projects', JSON.stringify(projects.value));

    try {
      await api.put(`/projects/${updatedProject.id}`, updatedProject);
      projects.value[index].synced = true;
    } catch (err) {
      console.error('Failed to update project on server:', err);
    }
  }

  return {
    projects,
    isLoading,
    fetchProjects,
    addProject,
    deleteProject,
    updateProject
  };
});
