import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import styled from "styled-components";

const BASE_URL = "http://localhost:3000"; // Update if needed

// Styled components for consistency
const Container = styled.div`
  font-family: 'Arial', sans-serif;
  padding: 30px;
  background-color: #f4f6f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h2`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 600;
`;

const Button = styled.button`
  padding: 12px 18px;
  margin: 10px 0;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.85;
  }

  ${(props) =>
    props.primary &&
    `
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
  `}

  ${(props) =>
    props.secondary &&
    `
    background-color: #2196F3;
    color: white;
  `}

  ${(props) =>
    props.danger &&
    `
    background-color: #f44336;
    color: white;
  `}
`;

const ProjectList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ProjectItem = styled.li`
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProjectTitle = styled.h4`
  color: #333;
  font-size: 20px;
  font-weight: 600;
`;

const UserList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const UserItem = styled.li`
  margin-bottom: 12px;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const SelectContainer = styled.div`
  margin: 15px 0;
`;

const AssignedUserList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
`;

const TableHeader = styled.th`
  background-color: #4CAF50;
  color: white;
  padding: 12px;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
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

const ProjectsAndTasksSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #f9fafb;
  border: 1px solid #e1e2e6;
  border-radius: 8px;
`;

const AdminDashboard = ({ token, onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [userProjects, setUserProjects] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await axios.get(`${BASE_URL}/admin/active_projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projectRes.data);

        const userRes = await axios.get(`${BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(userRes.data);

        const initialSelectedUsers = {};
        projectRes.data.forEach((project) => {
          initialSelectedUsers[project.id] = project.users.map((user) => ({
            value: user.id,
            label: user.name,
          }));
        });
        setSelectedUsers(initialSelectedUsers);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
  }, [token]);

  const fetchUserProjectsAndTasks = async (userId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/user_projects_and_tasks/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserProjects({ ...userProjects, [userId]: response.data });
    } catch (err) {
      console.error("Failed to fetch user projects and tasks", err);
    }
  };

  const saveProjectAssignments = async (projectId) => {
    try {
      const userIds = selectedUsers[projectId]?.map((user) => user.value) || [];

      await axios.post(
        `${BASE_URL}/admin/update_project_users`,
        { user_ids: userIds, project_id: projectId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Users updated successfully!");
    } catch (err) {
      alert("Failed to update users.");
    }
  };

  return (
    <Container>
      <Header>
        <Title>Admin Dashboard</Title>
        <LogoutButton onClick={onLogout}>Logout</LogoutButton>
      </Header>


      <h3>Active Projects</h3>
      <ProjectList>
        {projects.map((project) => (
          <ProjectItem key={project.id}>
            <ProjectTitle>{project.name}</ProjectTitle>
            <p>Start Date: {project.start_date}</p>
            <p>Duration: {project.duration} days</p>

            <SelectContainer>
              <h5>Select Users</h5>
              <Select
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                isMulti
                value={selectedUsers[project.id] || []}
                onChange={(selected) =>
                  setSelectedUsers({
                    ...selectedUsers,
                    [project.id]: selected,
                  })
                }
                placeholder="Select users..."
              />
            </SelectContainer>

            <Button secondary onClick={() => saveProjectAssignments(project.id)}>
              Save
            </Button>

            <h5>Assigned Users</h5>
            <UserList>
              {project.users.map((user) => (
                <UserItem key={user.id}>
                  {user.name} - {user.role}
                  <Button
                    secondary
                    onClick={() => fetchUserProjectsAndTasks(user.id)}
                  >
                    View Projects and Tasks
                  </Button>

                  {userProjects[user.id] && (
                    <ProjectsAndTasksSection>
                      <h6>Projects and Tasks:</h6>

                      <TaskTable>
                        <thead>
                          <tr>
                            <TableHeader>Task Name</TableHeader>
                            <TableHeader>Duration (Days)</TableHeader>
                            <TableHeader>Start Time</TableHeader>
                            <TableHeader>End Time</TableHeader>
                          </tr>
                        </thead>
                        <tbody>
                          {userProjects[user.id].map((userProject) => (
                            <tr key={userProject.project_name}>
                              <TableCell>{userProject.project_name}</TableCell>
                              <TableCell>{userProject.tasks.length}</TableCell>
                              <TableCell>
                                {userProject.tasks[0]?.task_start_time}
                              </TableCell>
                              <TableCell>
                                {userProject.tasks[0]?.task_end_time}
                              </TableCell>
                            </tr>
                          ))}
                        </tbody>
                      </TaskTable>
                    </ProjectsAndTasksSection>
                  )}
                </UserItem>
              ))}
            </UserList>
          </ProjectItem>
        ))}
      </ProjectList>
    </Container>
  );
};

export default AdminDashboard;
