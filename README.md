# 📝 Summarizing app

A ai text and files summarizing application built using **Vite (React)** for the frontend and **Django (REST API)** for the backend.


## 📁 Project Structure

todo-app/
├── backend/ # Django project and app
│ ├── manage.py
│ ├── todo/ # Django app for task management
│ └── ...
├── frontend/ # Vite + React frontend
│ ├── index.html
│ ├── src/
│ │ └── ...
│ └── ...
└── README.md

---

## 🛠️ Tech Stack

### Frontend
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Axios](https://axios-http.com/) for HTTP requests

### Backend
- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)

---


## ⚙️ Setup Instructions

### Backend (Django)
1. **Navigate to the backend folder:**
   ```bash
   cd backend
   python -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend (React)
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

