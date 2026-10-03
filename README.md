# Real-Time Chat Application

A full-stack real-time chat application built using the **MERN stack** and **Socket.IO**. The application provides real-time messaging along with authentication, typing indicators, online/offline status, message delivery/read status, user profiles, and image uploads.

The application is containerized using **Docker** and deployed on **AWS EC2** with **Nginx** as a reverse proxy.

## Live Demo

**Live Application:** http://54.87.37.174

> Note: The application is deployed on an AWS EC2 public IP. The IP address may change if the EC2 instance is stopped and started.

---

## Technologies Used

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS
- React Hot Toast
- Font Awesome
- Socket.IO Client
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT
- bcrypt

### Image Upload
- Multer
- Cloudinary

### DevOps & Deployment
- Docker
- Docker Compose
- Nginx
- AWS EC2
- Amazon Linux 2023
- Git & GitHub

---

## Features

### Authentication
- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes
- Persistent authentication

### Real-Time Messaging
- Real-time one-to-one messaging using Socket.IO
- Message history
- Messages stored in MongoDB
- Messages appear without page refresh
- Automatic real-time communication between users

### Typing Indicator
- Displays when another user is typing
- Uses Socket.IO events for real-time updates

### Online/Offline Status
- Displays the user's online/offline status. 

### Message Status
- Sent status
- Delivered status
- Read status
- Check and double-check indicators

### Message Timestamps
- Displays the time for each message
- Date separators between different days
- Displays:
  - Today
  - Yesterday
  - Full date for older messages

### User Profiles
- Profile picture
- First name
- Last name
- Bio/About
- Profile information stored in MongoDB
- Users can view another user's profile information

### Image Upload
- Profile image upload
- Multer for handling multipart form data
- Cloudinary for cloud image storage

### Responsive UI
- Desktop-friendly chat interface
- Mobile responsive layout
- Mobile sidebar navigation
- Back button for mobile chat navigation

---

# Project Structure

```text
realtime-chat-app/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utilities/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── .gitignore
└── README.md
```

---

# Docker Setup

The application uses separate Docker containers for the frontend and backend.

### Backend Container

```text
Node.js + Express + Socket.IO
Port: 5000
```

### Frontend Container

```text
React + Nginx
Port: 80
```

---

# Local Development

Clone the repository:

```bash
git clone https://github.com/Nikitarathod2001/realtime-chat-app.git
```

Go to the project:

```bash
cd realtime-chat-app
```

Create your backend environment file:

```text
server/.env
```

Add the required environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the application using Docker Compose:

```bash
docker compose up -d --build
```

The application will be available at:

```text
http://localhost:5173
```

---

## AWS EC2 Deployment

The application is deployed on an **AWS EC2 instance** using Docker and Docker Compose.

---

## Nginx Reverse Proxy

Nginx is used as a reverse proxy in the frontend container.


---

# Deployment Workflow

After making changes locally:

```bash
git add .
```

```bash
git commit -m "Update application"
```

```bash
git push origin main
```

SSH into the EC2 instance:

```bash
ssh -i "realtime-chat-key.pem" ec2-user@YOUR_EC2_PUBLIC_IP
```

Go to the project:

```bash
cd ~/realtime-chat-app
```

Pull the latest code:

```bash
git pull origin main
```

Rebuild and restart the production containers:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

# Future Improvements

Possible future enhancements include:

- HTTPS with a custom domain
- Group chats
- Message deletion
- Message editing
- File and media sharing
- Push notifications
- Searchable chat history
- Automated CI/CD deployment

---

# Author

**Nikita Rathod**

B.E. Computer Engineering

---

# THANK YOU!