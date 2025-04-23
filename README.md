# AI-Powered Content Summarization API

A Django REST API that uses Google's Gemini AI to automatically generate summaries, extract keywords, and create titles from text or document uploads.

## 🚀 Features

- **Text Processing**: Upload documents (PDF, DOCX, TXT) or input text directly
- **AI-Powered Analysis**: Leverages Google's Gemini AI to:
  - Generate concise summaries with adjustable length
  - Extract relevant keywords
  - Create appropriate titles
- **Multiple Export Formats**: Download processed content as:
  - PDF documents with professional formatting
  - DOCX (Microsoft Word) files
  - Plain text files
- **Secure Authentication**: JWT-based authentication system
- **RESTful API**: Well-structured endpoints for easy integration

## 📋 Requirements

- Python 3.8+
- Django 5.2+
- Django REST Framework
- Google Generative AI Python SDK
- PyPDF2 (for PDF processing)
- python-docx (for DOCX processing)
- ReportLab (for PDF generation)

## 🔧 Installation

1. **Clone the repository**

```bash
git clone https://github.com/AshrafJB2/pfeProject.git
cd pfeProject
```

2. **Create and activate a virtual environment**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Set up environment variables**

Create a `.env` file in the project root with:

```
SECRET_KEY=your_django_secret_key
GEMINI_API_KEY=your_gemini_api_key
DEBUG=True
```

5. **Run migrations**

```bash
python manage.py migrate
```

6. **Create a superuser**

```bash
python manage.py createsuperuser
```

7. **Start the development server**

```bash
python manage.py runserver
```

The API will be available at http://127.0.0.1:8000/api/

## 🔑 API Authentication

This API uses JWT (JSON Web Token) authentication:

1. **Obtain a token**:
```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'
```

2. **Use the token in requests**:
```bash
curl -X GET http://127.0.0.1:8000/api/content/ \
  -H "Authorization: Bearer your_access_token"
```

3. **Refresh an expired token**:
```bash
curl -X POST http://127.0.0.1:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh":"your_refresh_token"}'
```

## 📚 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/token/` | POST | Obtain JWT token |
| `/api/token/refresh/` | POST | Refresh JWT token |
| `/api/content/` | GET | List all content |
| `/api/content/` | POST | Create new content |
| `/api/content/{id}/` | GET | Retrieve content details |
| `/api/content/{id}/download/` | GET | Download content in specified format |

For detailed API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## 📊 Content Processing Flow

1. **Input**: User uploads a document or provides text
2. **Text Extraction**: System extracts plain text from documents
3. **AI Processing**: Gemini AI analyzes the text to:
   - Generate a summary based on specified length
   - Extract relevant keywords
   - Create a concise title
4. **Storage**: Results are stored in the database
5. **Retrieval**: Content can be retrieved via API
6. **Export**: Content can be downloaded in various formats

## 🧪 Running Tests

```bash
python manage.py test
```

## 🔒 Security Considerations

- API keys are stored in environment variables, not in code
- JWT tokens expire after 5 minutes (configurable)
- Authentication is required for all content operations
- Input validation is performed on all requests

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/content-summarization-api](https://github.com/yourusername/content-summarization-api)
