# Contact Management API

A Node.js API service that identifies and manages contact information, handling the consolidation of contact records based on matching email addresses and phone numbers.

## Live Demo
API Endpoint: `https://bite-speed-tau.vercel.app/api/identify`

## Features

- Contact identification and linking
- Automatic primary/secondary contact relationship management
- Duplicate contact detection and consolidation
- RESTful API endpoints
- MongoDB integration for data persistence

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/HrithikKeshri10/BiteSpeed
cd bitespeed
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

## Usage

### Starting the Server
```bash
npm start
```

The server will start running on the specified port (default: 3000).

### API Endpoints

#### POST /api/identify

Identifies and consolidates contact information based on email and phone number.

**Request Body:**
```json
{
  "email": "user@example.com",
  "phoneNumber": "1234567890"
}
```

**Response:**
```json
{
  "contact": {
    "primaryContactId": "primary-contact-id",
    "emails": ["user@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": ["secondary-contact-id"]
  }
}
```

## Data Model

### Contact Schema

```javascript
{
  phoneNumber: String,
  email: String,
  linkedId: ObjectId,
  linkPrecedence: "primary" | "secondary",
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date
}
```

## Architecture

The project follows a layered architecture:

- **Routes** (`/src/routes`): API endpoint definitions
- **Controllers** (`/src/controllers`): Request handling and response formatting
- **Services** (`/src/services`): Business logic implementation
- **Models** (`/src/models`): Database schema definitions

### Try it Out

The API is deployed and can be accessed at:
```
https://bite-speed-tau.vercel.app
```

To test the API using Postman, you can either use the deployed version or run it locally. Simply replace `http://localhost:3000` with `https://bite-speed-tau.vercel.app` in the test cases below to use the deployed version.
#### Setup in Postman
1. Open Postman
2. Create a new Collection called "Contact Management API"
3. Add a new request:
   - Method: POST
   - URL: `https://bite-speed-tau.vercel.app/api/identify`
   - Headers: Add `Content-Type: application/json`

#### Test Cases

1. **Create New Contact**
   - Body:
     ```json
     {
         "email": "test@example.com",
         "phoneNumber": "1234567890"
     }
     ```
   - Expected Response:
     ```json
     {
         "contact": {
             "primaryContactId": "generated-id",
             "emails": ["test@example.com"],
             "phoneNumbers": ["1234567890"],
             "secondaryContactIds": []
         }
     }
     ```

2. **Link with Existing Email**
   - Body:
     ```json
     {
         "email": "test@example.com",
         "phoneNumber": "9876543210"
     }
     ```
   - This will link with the previous contact

3. **Link with Existing Phone**
   - Body:
     ```json
     {
         "email": "new@example.com",
         "phoneNumber": "1234567890"
     }
     ```
   - This will link with the first contact

#### Example Scenarios

1. **Creating a New Contact**
   - Send a request with new email and phone number
   - Response will show a primary contact with no secondary contacts

2. **Linking Existing Contacts**
   - Send a request with an existing email but new phone number
   - Response will show the primary contact and any linked secondary contacts

3. **Identifying Duplicates**
   - Send a request with both email and phone number that exist in different records
   - System will automatically link them and designate one as primary

## Error Handling

The API includes global error handling middleware that catches and formats errors appropriately. All errors are returned in a consistent format:

```json
{
  "error": "Error message"
}
```

## Dependencies

- express: Web framework for Node.js
- mongoose: MongoDB object modeling tool
- dotenv: Environment variable management

## Author

Hrithik Keshri
