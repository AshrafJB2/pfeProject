# API Documentation

This document provides comprehensive information on how to interact with the APIs in this application.

## Base URL

All API endpoints are prefixed with `/api/`. When running the development server, the full base URL is:

```
http://127.0.0.1:8000/api/
```

## Authentication

This API uses JWT (JSON Web Token) authentication. To access protected endpoints, you need to:

1. Obtain a token
2. Include the token in the Authorization header of your requests

### Obtaining a Token

**Endpoint:** `/api/token/`

**Method:** POST

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

The `access` token is valid for 5 minutes. Use this token in your API requests.

### Refreshing a Token

When your access token expires, you can use the refresh token to get a new access token.

**Endpoint:** `/api/token/refresh/`

**Method:** POST

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Using the Token

Include the access token in the Authorization header of your requests:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## Content Endpoints

### 1. List and Create Content

**Endpoint:** `/api/content/`

#### GET - List all content

**Method:** GET

**Authentication:** Required

**Response:**
```json
[
  {
    "id": 1,
    "original_file": null,
    "original_text": "Sample text content...",
    "summary_length": "medium",
    "created_at": "2025-04-17T21:30:00Z",
    "extracted_text": "Sample text content...",
    "summary": "This is a summary of the content...",
    "keywords": "sample, content, text",
    "auto_title": "Sample Content Title"
  },
  {
    "id": 2,
    "original_file": "http://127.0.0.1:8000/media/documents/sample.pdf",
    "original_text": null,
    "summary_length": "long",
    "created_at": "2025-04-17T22:15:00Z",
    "extracted_text": "Extracted text from PDF...",
    "summary": "This is a longer summary of the PDF content...",
    "keywords": "pdf, sample, document",
    "auto_title": "PDF Document Analysis"
  }
]
```

#### POST - Create new content

**Method:** POST

**Authentication:** Required

**Request Body:**

You can provide either `original_file` or `original_text`, but at least one is required.

With text:
```json
{
  "original_text": "Your text content to be analyzed...",
  "summary_length": "medium"
}
```

With file (using form-data):
```
original_file: [FILE]
summary_length: medium
```

The `summary_length` field accepts: `short`, `medium`, or `long`.

**Response:**
```json
{
  "id": 3,
  "original_file": null,
  "original_text": "Your text content to be analyzed...",
  "summary_length": "medium",
  "created_at": "2025-04-18T10:00:00Z",
  "extracted_text": "Your text content to be analyzed...",
  "summary": "AI-generated summary of your content...",
  "keywords": "ai, generated, keywords",
  "auto_title": "AI Generated Title"
}
```

### 2. Retrieve Content Details

**Endpoint:** `/api/content/{id}/`

**Method:** GET

**Authentication:** Required

**Response:**
```json
{
  "id": 1,
  "title": "Sample Content Title",
  "summary": "This is a summary of the content...",
  "keywords": "sample, content, text",
  "original_text": "Sample text content...",
  "summary_length": "medium",
  "created_at": "2025-04-17T21:30:00Z"
}
```

### 3. Download Content in Different Formats

**Endpoint:** `/api/content/{id}/download/{format}`

**Method:** GET

**Authentication:** Required

**URL Parameters:**
- `id`: The ID of the content to download
- `format`: The format to download the content in. Supported formats:
  - `docx`: Microsoft Word document
  - `pdf`: PDF document
  - `txt`: Plain text file

**Example URLs:**
- `/api/content/1/download/docx`
- `/api/content/1/download/pdf`
- `/api/content/1/download/txt`

**Response:**
The API will return the file as an attachment with the appropriate content type.

## Error Handling

The API returns standard HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request (e.g., missing required fields)
- `401 Unauthorized`: Authentication required or failed
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses include a detail message:

```json
{
  "detail": "Error message here"
}
```

## Examples Using cURL

### Authentication
```bash
# Get token
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'

# Use token
export TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### List Content
```bash
curl -X GET http://127.0.0.1:8000/api/content/ \
  -H "Authorization: Bearer $TOKEN"
```

### Create Content with Text
```bash
curl -X POST http://127.0.0.1:8000/api/content/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"original_text":"Text to analyze","summary_length":"medium"}'
```

### Create Content with File
```bash
curl -X POST http://127.0.0.1:8000/api/content/ \
  -H "Authorization: Bearer $TOKEN" \
  -F "original_file=@/path/to/your/file.pdf" \
  -F "summary_length=medium"
```

### Get Content Details
```bash
curl -X GET http://127.0.0.1:8000/api/content/1/ \
  -H "Authorization: Bearer $TOKEN"
```

### Download Content
```bash
# Download as DOCX
curl -X GET http://127.0.0.1:8000/api/content/1/download/docx \
  -H "Authorization: Bearer $TOKEN" \
  -O -J

# Download as PDF
curl -X GET http://127.0.0.1:8000/api/content/1/download/pdf \
  -H "Authorization: Bearer $TOKEN" \
  -O -J

# Download as TXT
curl -X GET http://127.0.0.1:8000/api/content/1/download/txt \
  -H "Authorization: Bearer $TOKEN" \
  -O -J
```

## Examples Using JavaScript (Fetch API)

### Authentication
```javascript
// Get token
async function getToken(username, password) {
  const response = await fetch('http://127.0.0.1:8000/api/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  
  return await response.json();
}

// Example usage
const tokens = await getToken('your_username', 'your_password');
const accessToken = tokens.access;
```

### List Content
```javascript
async function listContent(token) {
  const response = await fetch('http://127.0.0.1:8000/api/content/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return await response.json();
}
```

### Create Content with Text
```javascript
async function createContentWithText(token, text, summaryLength) {
  const response = await fetch('http://127.0.0.1:8000/api/content/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      original_text: text,
      summary_length: summaryLength,
    }),
  });
  
  return await response.json();
}
```

### Create Content with File
```javascript
async function createContentWithFile(token, file, summaryLength) {
  const formData = new FormData();
  formData.append('original_file', file);
  formData.append('summary_length', summaryLength);
  
  const response = await fetch('http://127.0.0.1:8000/api/content/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  return await response.json();
}
```

### Get Content Details
```javascript
async function getContentDetails(token, id) {
  const response = await fetch(`http://127.0.0.1:8000/api/content/${id}/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return await response.json();
}
```

### Download Content
```javascript
async function downloadContent(token, id, format) {
  const response = await fetch(`http://127.0.0.1:8000/api/content/${id}/download/${format}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  // For handling file downloads
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `content.${format}`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
```

## Troubleshooting

### Common Issues

1. **"Not Found" Error (404)**
   - Check that you're using the correct endpoint URL
   - Verify that the content ID exists in the database
   - Ensure the URL format is correct (e.g., `/api/content/1/download/docx`)

2. **"Unauthorized" Error (401)**
   - Your token may have expired. Try refreshing it.
   - Ensure you're including the token in the Authorization header.
   - Check that the token format is correct: `Bearer <token>`

3. **"Bad Request" Error (400)**
   - Check that your request body contains all required fields.
   - Ensure the format of your data is correct.
   - For file uploads, verify that the file is valid and not corrupted.

4. **File Download Issues**
   - Ensure you're using the correct format parameter in the URL.
   - Check that the content ID exists and has been processed successfully.
   - Verify that your authentication token is valid.
