import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  padding: 24px;
  background-color: #f7fafc;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;

const LogoutButton = styled.button`
  background-color: #f56565;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #e53e3e;
  }
`;

const ProjectsTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const ProjectCard = styled.div`
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
`;

const ProjectName = styled.h4`
  font-size: 18px;
  font-weight: 600;
`;

const TasksTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const TableHeader = styled.th`
  padding: 8px;
  background-color: #edf2f7;
  border: 1px solid #e2e8f0;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 8px;
  border: 1px solid #e2e8f0;
`;

const TaskForm = styled.form`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin: 0;
`;

const SubmitButton = styled.button`
  background-color: ${(props) => (props.disabled ? '#A0AEC0' : '#4299e1')};
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  width: 100%;
  border: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background-color: ${(props) => (props.disabled ? '#A0AEC0' : '#3182ce')};
  }
`;

const UserInfo = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #2d3748;
`;

const UserDashboard = ({ token, onLogout }) => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [taskInputs, setTaskInputs] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const userResponse = await axios.get('/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        const response = await axios.get('/user/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);

        const initialTaskInputs = response.data.reduce((acc, project) => {
          acc[project.id] = { name: '', description: '', duration: '', start_time: '', end_time: '' };
          return acc;
        }, {});
        setTaskInputs(initialTaskInputs);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchUserProjects();
  }, [token]);

  const validateTask = (projectId, field, value) => {
    let errorMsg = '';
    const task = { ...taskInputs[projectId], [field]: value };

    const startTime = new Date(task.start_time);
    const endTime = new Date(task.end_time);
    const now = new Date();

    if (field === 'start_time') {
      if(startTime < now) {
        errorMsg = 'Start time cannot be in the past.';
      } else if (endTime <= startTime) {
        errorMsg = 'Start time must be before end time.';
      }
    } else if (field === 'end_time' && endTime <= startTime) {
      errorMsg = 'End time must be after start time.';
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [projectId]: { ...prevErrors[projectId], [field]: errorMsg },
    }));
  };

  const handleInputChange = (e, projectId) => {
    const { name, value } = e.target;

    setTaskInputs({
      ...taskInputs,
      [projectId]: {
        ...taskInputs[projectId],
        [name]: value,
      },
    });

    validateTask(projectId, name, value);
  };

  const handleTaskSubmit = async (e, projectId) => {
    e.preventDefault();
    const newTask = taskInputs[projectId];

    if (errors[projectId]?.start_time || errors[projectId]?.end_time) {
      return;
    }

    try {
      const response = await axios.post(
        `/user/tasks`,
        { task: { project_id: projectId, ...newTask } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? { ...project, tasks: [...project.tasks, response.data] }
            : project
        )
      );

      setTaskInputs({
        ...taskInputs,
        [projectId]: { name: '', description: '', duration: '', start_time: '', end_time: '' },
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>User Dashboard</Title>
        {user ? (
          <UserInfo>Logged in as: <strong>{user.name || user.email}</strong></UserInfo>
        ) : (
          <UserInfo>Loading user...</UserInfo>
        )}
        <LogoutButton onClick={onLogout}>Logout</LogoutButton>
      </Header>

      <ProjectsTitle>Your Projects</ProjectsTitle>

      <div>
        {projects.map((project) => (
          <ProjectCard key={project.id}>
            <ProjectName>{project.name}</ProjectName>

            <h5>Tasks:</h5>
            {project.tasks.length > 0 ? (
              <TasksTable>
                <thead>
                  <tr>
                    <TableHeader>Task Name</TableHeader>
                    <TableHeader>Description</TableHeader>
                    <TableHeader>Start Time</TableHeader>
                    <TableHeader>End Time</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {project.tasks.map((task) => (
                    <tr key={task.id}>
                      <TableCell>{task.name}</TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>{format(new Date(task.start_time), 'p, MMM d')}</TableCell>
                      <TableCell>{format(new Date(task.end_time), 'p, MMM d')}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </TasksTable>
            ) : (
              <p>No tasks added yet.</p>
            )}

            <TaskForm onSubmit={(e) => handleTaskSubmit(e, project.id)}>
            <Input
                  type="text"
                  name="name"
                  value={taskInputs[project.id]?.name || ''}
                  onChange={(e) => handleInputChange(e, project.id)}
                  placeholder="Task Name"
                  required
                />
                <Input
                  type="text"
                  name="description"
                  value={taskInputs[project.id]?.description || ''}
                  onChange={(e) => handleInputChange(e, project.id)}
                  placeholder="Task Description"
                  required
                />
                <Input
                  type="number"
                  name="duration"
                  value={taskInputs[project.id]?.duration || ''}
                  onChange={(e) => handleInputChange(e, project.id)}
                  placeholder="Duration (in minutes)"
                  required
                />
              
              <Input type="datetime-local" name="start_time" value={taskInputs[project.id]?.start_time || ''} onChange={(e) => handleInputChange(e, project.id)} required />
              {errors[project.id]?.start_time && <ErrorMessage>{errors[project.id].start_time}</ErrorMessage>}

              <Input type="datetime-local" name="end_time" value={taskInputs[project.id]?.end_time || ''} onChange={(e) => handleInputChange(e, project.id)} required />
              {errors[project.id]?.end_time && <ErrorMessage>{errors[project.id].end_time}</ErrorMessage>}

              <SubmitButton type="submit" disabled={!!errors[project.id]?.start_time || !!errors[project.id]?.end_time}>Add Task</SubmitButton>
            </TaskForm>
          </ProjectCard>
        ))}
      </div>
    </Container>
  );
};

export default UserDashboard;
