# Contract Management Platform

A full-stack web application for managing contract blueprints and their lifecycle, built with React, Node.js, Express, and MongoDB.

## Live Link
contract-management-platform-lime.vercel.app

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm
- MongoDB Atlas account (free tier)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file in `backend/` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/contract-management?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173
```

3. Get MongoDB connection string:
   - Sign up at https://cloud.mongodb.com/
   - Create a free M0 cluster
   - Create database user
   - Get connection string from "Connect" → "Drivers"
   - Replace `<password>` with your actual password

4. Start backend server:
```bash
npm start
```

Expected output: `✓ Connected to MongoDB` and `✓ Server running on port 5000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser at `http://localhost:5173`

## Architecture Overview

### System Architecture
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  React Frontend │◄───────►│  Express API    │◄───────►│  MongoDB Atlas  │
│  (Port 5173)    │   HTTP  │  (Port 5000)    │         │    Database     │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### Technology Stack

**Frontend:**
- React 19 - UI framework
- Vite - Build tool and dev server
- Axios - HTTP client for API calls
- Context API - State management

**Backend:**
- Node.js - JavaScript runtime
- Express.js - Web framework
- MongoDB Atlas - Cloud NoSQL database
- Mongoose - MongoDB ODM
- express-validator - Request validation

### Data Flow
1. User interacts with React components
2. Frontend makes API requests via Axios
3. Express backend validates requests
4. Mongoose performs database operations
5. Response sent back to frontend
6. React updates UI with new data

### Project Structure
```
eurusys/
├── backend/
│   ├── models/              # Mongoose schemas
│   │   ├── Blueprint.js     # Blueprint model
│   │   └── Contract.js      # Contract model with state machine
│   ├── routes/              # API endpoints
│   │   ├── blueprints.js    # Blueprint CRUD
│   │   └── contracts.js     # Contract CRUD + lifecycle
│   ├── middleware/
│   │   ├── validators.js    # Request validation
│   │   └── errorHandler.js  # Error handling
│   └── server.js            # Express server setup
├── src/
│   ├── components/          # React components
│   ├── context/             # Global state management
│   ├── services/            # API service layer
│   └── utils/               # Helper functions
└── README.md
```

## API Design Summary

### Base URL
```
http://localhost:5000/api
```

### Blueprint Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/blueprints` | Get all blueprints |
| GET | `/blueprints/:id` | Get single blueprint |
| POST | `/blueprints` | Create new blueprint |
| PUT | `/blueprints/:id` | Update blueprint |
| DELETE | `/blueprints/:id` | Delete blueprint |

**Blueprint Schema:**
```javascript
{
  name: String,
  fields: [{
    type: String,        // 'text' | 'date' | 'signature' | 'checkbox'
    label: String,
    position: { x: Number, y: Number }
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Contract Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contracts` | Get all contracts |
| GET | `/contracts?filter=active\|pending\|signed` | Get filtered contracts |
| GET | `/contracts/:id` | Get single contract |
| POST | `/contracts` | Create contract from blueprint |
| PUT | `/contracts/:id` | Update contract fields |
| PATCH | `/contracts/:id/state` | Change contract state |
| DELETE | `/contracts/:id` | Delete contract |

**Contract Schema:**
```javascript
{
  name: String,
  blueprintId: ObjectId,
  blueprintName: String,
  state: String,       // 'created' | 'approved' | 'sent' | 'signed' | 'locked' | 'revoked'
  fields: [{
    type: String,
    label: String,
    position: { x: Number, y: Number },
    value: Mixed
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### State Machine

Contract lifecycle follows strict state transitions:
```
Created → Approved → Sent → Signed → Locked
    ↓         ↓        ↓
         Revoked
```

**Validation Rules:**
- Transitions enforced on backend via `canTransitionTo()` method
- Invalid transitions return 400 error
- Locked contracts are immutable
- Revoked contracts cannot progress

### Request/Response Examples

**Create Blueprint:**
```json
POST /api/blueprints
{
  "name": "Employment Contract",
  "fields": [
    {
      "type": "text",
      "label": "Employee Name",
      "position": { "x": 100, "y": 50 }
    },
    {
      "type": "date",
      "label": "Start Date",
      "position": { "x": 100, "y": 100 }
    }
  ]
}
```

**Create Contract:**
```json
POST /api/contracts
{
  "name": "John Doe Employment Contract",
  "blueprintId": "507f1f77bcf86cd799439011"
}
```

**Change State:**
```json
PATCH /api/contracts/:id/state
{
  "newState": "approved"
}
```

### Error Handling

All errors return consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": []  // Optional validation errors
}
```

**HTTP Status Codes:**
- 200 - Success
- 201 - Created
- 400 - Bad Request (validation error)
- 403 - Forbidden (e.g., editing locked contract)
- 404 - Not Found
- 500 - Internal Server Error

## Assumptions and Trade-offs

### Assumptions

1. **Single User System**
   - No authentication or authorization required
   - All users have full access to all contracts
   - Suitable for assignment scope and demonstration purposes

2. **Linear Workflow**
   - Contracts follow a predefined linear progression
   - No parallel approval paths or complex branching
   - Revoked state is the only exception to linear flow

3. **Simple Field Positioning**
   - Fields positioned using x,y coordinates
   - No visual canvas or drag-and-drop interface
   - Sufficient for demonstrating data structure

4. **Cloud Database**
   - MongoDB Atlas used instead of local MongoDB
   - Requires internet connection
   - Free tier sufficient for development and testing

### Trade-offs

#### MongoDB vs PostgreSQL
**Chose MongoDB:**
- ✅ Flexible schema for dynamic field structures
- ✅ Faster development with Mongoose ODM
- ✅ Easy to work with in JavaScript ecosystem
- ✅ Good fit for document-based data (blueprints/contracts)

**Trade-off:**
- ❌ Less suitable for complex relationships
- ❌ No built-in ACID transactions across collections
- ❌ PostgreSQL would be better for strict data integrity requirements

#### No Authentication
**Chose to skip authentication:**
- ✅ Simplified implementation for assignment scope
- ✅ Focus on core functionality (blueprints, contracts, lifecycle)
- ✅ Easier to test and demonstrate

**Trade-off:**
- ❌ Not production-ready
- ❌ Would need JWT/OAuth for real-world use
- ❌ No user-specific data or permissions

#### Simple Positioning System
**Chose x,y coordinates:**
- ✅ Simple to implement and understand
- ✅ Demonstrates data structure clearly
- ✅ Sufficient for backend validation

**Trade-off:**
- ❌ Not user-friendly for non-technical users
- ❌ Drag-and-drop would be more intuitive
- ❌ No visual feedback during field placement

#### Express vs NestJS
**Chose Express:**
- ✅ Simpler and more straightforward
- ✅ Large community and ecosystem
- ✅ Faster to set up and develop

**Trade-off:**
- ❌ Less structure than NestJS
- ❌ Manual organization of code
- ❌ NestJS would provide better TypeScript support and dependency injection

#### Context API vs Redux
**Chose Context API:**
- ✅ Built into React, no extra dependencies
- ✅ Sufficient for this application's complexity
- ✅ Easier to understand and maintain

**Trade-off:**
- ❌ Less powerful than Redux for complex state
- ❌ No time-travel debugging
- ❌ Redux would be better for larger applications

### Known Limitations

1. **No File Attachments** - Real contracts would need PDF/document support
2. **No Email Notifications** - State changes don't trigger notifications
3. **No Audit Trail** - No history of who changed what and when
4. **No Role-Based Access** - Everyone has same permissions
5. **Basic Error Messages** - Could be more user-friendly
6. **No Offline Support** - Requires active internet connection
7. **No Data Export** - Cannot export contracts to PDF or other formats

### Future Enhancements

If extended beyond assignment scope:
- User authentication with JWT
- Role-based access control (creator, approver, signer)
- PDF generation and export
- Email notifications for state changes
- Audit trail and version history
- Drag-and-drop field builder
- File attachment support
- Advanced search and filtering
- Unit and integration tests
- Docker containerization for deployment
