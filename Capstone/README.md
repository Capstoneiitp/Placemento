# Placemento 🚀
### AI-Powered Placement Readiness & Skill Analysis Platform

Placemento is a comprehensive capstone project designed to help college students assess their career readiness. It leverages **Machine Learning** to predict placement probability and **Generative AI** to provide personalized career coaching and skill gap analysis.

---

## 🌟 Key Features

- **ML Placement Predictor**: Uses a Scikit-learn model to predict the likelihood of a student getting placed based on CGPA, DSA skills, internships, and projects.
- **AI Career Chatbot**: An integrated assistant powered by **Google Gemini 2.0 Flash** that analyzes your specific results and provides actionable advice.
- **Dynamic Skill Analysis**: Interactive visualizations (powered by Chart.js) that compare your current skills against industry benchmarks.
- **Skill Gap Identification**: Automatically identifies weaknesses in your profile (e.g., "Improve DSA", "Build more projects") and suggests resources.
- **User Management**: Full secure system for login, registration, profile updates, and account settings.

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5 & Vanilla CSS3
- JavaScript (ES6+)
- [Chart.js](https://www.chartjs.org/) (Data Visualization)
- [tsparticles](https://particles.js.org/) (Interactive Backgrounds)

**Backend:**
- [Django](https://www.djangoproject.com/) (Python Web Framework)
- Scikit-learn & Joblib (Machine Learning)
- Google Gemini AI SDK (google-genai)

---

## 🚀 Getting Started

# Environment Setup

Follow these steps to run the project locally.

---

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

---

## 2. Backend Setup (Django)

### Navigate to Backend

```bash
cd Backend/placement_ml_project
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

#### Windows

```bash
venv\Scripts\activate
```

#### Mac/Linux

```bash
source venv/bin/activate
```

---

## 3. Install Required Packages

```bash
pip install django django-cors-headers google-genai python-dotenv

(Optional)

```bash
pip install google-genai
```

---

## 4. Run Database Migrations

```bash
python manage.py migrate
```

---

## 5. Start Django Backend Server

```bash
python manage.py runserver
```

Backend will run on:

```text
http://127.0.0.1:8000
```

---

## 6. Frontend Setup

Open the `Frontend` folder in VS Code.

Install the **Live Server** extension.

Then:

- Right click `index.html`
- Click **Open with Live Server**

Frontend will run on:

```text
http://127.0.0.1:5501
```

---

## 7. Important Notes

- Keep Django backend running while using frontend.
- Make sure CORS is enabled in Django settings.
- Backend APIs used:
  - `/register/`
  - `/login/`
  - `/predict/`
  - `/api/chat/`

---

## 8. Troubleshooting

### Django not found

```bash
pip install django
```

### CORS Error

```bash
pip install django-cors-headers
```

Add in `settings.py`:

```python
INSTALLED_APPS = [
    'corsheaders',
]
```

```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
]
```

```python
CORS_ALLOW_ALL_ORIGINS = True
```

### Server not running

Run:

```bash
python manage.py runserver
```

## 📁 Project Structure

```text
├── Backend/
│   └── placement_ml_project/   # Unified Django Server
│       ├── predictor/          # ML Prediction & User App
│       ├── chatbot/            # Gemini AI Integration App
│       ├── placement_ml_project/# Project Configuration
│       ├── db.sqlite3          # Database
│       └── .env                # (Private) API keys & Secrets
├── Frontend/
│   ├── index.html              # Landing / Auth page
│   ├── dashboard.html          # Skill entry form
│   ├── analysis.html           # Results & Charts
│   ├── chatbot.html            # AI Coaching Interface
│   └── ...                     # JS & CSS assets
└── requirements.txt            # Project dependencies
```

---

## 📊 Machine Learning Model
The platform uses a **Random Forest** model trained on student placement datasets. It evaluates key metrics including:
- Academic Performance (CGPA)
- Technical Proficiency (DSA & Coding)
- Project & Internship Experience
- Aptitude & Communication Levels

---

## 📝 License
This project is for educational purposes as part of a College Capstone Project.
