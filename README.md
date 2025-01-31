## Project Management

A project management system with user roles, project tracking, and task management capabilities. The
application will include backend setup using Rails with API endpoints and
frontend integration using React.

---

## 🚀 Backend Setup (Port: 3000)

To get the backend up and running, follow the steps below:

### 1. Clone the Project Repository 

Clone the project repository to your local machine using the following command:

```
git clone https://github.com/akshay-cs-borade/project_management_backend.git
```

### 2. Update Database Configuration

Navigate to `config/database.yml` and update the database configurations (e.g., database name, username, password, etc.) based on your local setup.

### 3. Create the Database

Run the following command to create the database:

```bash
rake db:create
```

### 4. Run Migrations

Apply the migrations to update your database schema:

```bash
rake db:migrate
```

### 5. Seed the Database

Populate your database with seed data:

```bash
rake db:seed
```

### 6. Start the Rails Server

Now, run the Rails server:

```bash
rails s
```

Your backend server will be running at `http://localhost:3000`.

### 7. API Documentation

For API documentation, you can visit:

[API Documentation](http://localhost:3000/api-docs/index.html)

---

## 💻 Frontend Setup (Port: 3001)

To set up and run the frontend, follow the instructions below:

### 1. Clone the Frontend Repository

Clone the frontend project repository using the following command: 

```bash
git clone https://github.com/akshay-cs-borade/project-management-client.git
```

### 2. Install Dependencies

Navigate to the frontend directory and install the necessary dependencies:

```bash
npm install
```

### 3. Start the Frontend Server

Now, start the frontend server:

```bash
npm start
```

Your frontend will be accessible at `http://localhost:3001`.

---

## 📝 Notes

- Make sure both the backend and frontend servers are running simultaneously for the full functionality of the project.
- Ensure that your local environment matches the necessary configuration in the `database.yml` file.

---

### 🔧 Technologies Used:
- **Backend**: Ruby on Rails
- **Frontend**: React.js 
- **Database**: PostgreSQL 
- **API Docs**: Swagger / OpenAPI

---

## Screen-Shots 
![Task-Management-01-31-2025_09_24_PM (1)](https://github.com/user-attachments/assets/b80110b8-49d6-4278-a4ac-bd33049620e6)
![Task-Management-01-31-2025_09_23_PM](https://github.com/user-attachments/assets/b651f254-52cb-4cf8-a8a7-b881fd517b40)
![Task-Management-01-31-2025_09_24_PM](https://github.com/user-attachments/assets/19952c0b-0e60-4dca-89b2-0601dc9b4c25)

---
## Demo Video
https://github.com/user-attachments/assets/121a2153-9c71-4cb4-9f96-92ce4a14e1bc

---
## Testcase Coverage
![Code-coverage-for-Project-management-backend-01-31-2025_08_17_PM](https://github.com/user-attachments/assets/a1cf81c7-6d06-4088-a268-6607b8cedb93)

---

## API document screen-shot
![Swagger-UI-01-31-2025_08_17_PM](https://github.com/user-attachments/assets/d18bf417-e004-4bc3-b38d-a877dfa53030)

---
