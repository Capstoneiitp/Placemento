# Placemento: Setup Guide for a New PC / Mac

Follow these step-by-step instructions to get the Placemento project running on a new computer.

## 1. Transfer the Files
Copy the entire `capstone project` folder to your new PC or Mac.
**Important:** If you are using Git/GitHub to transfer the files, the `.env` file and `db.sqlite3` database files are likely ignored (due to `.gitignore`). You must manually create the `.env` file on the new machine (see Step 5).

## 2. Install Prerequisites
Ensure you have **Python 3.10 or higher** installed. 
To check your Python version, open a terminal or command prompt and run:
```bash
python --version
# or
python3 --version
```

## 3. Setup a Virtual Environment (Recommended)
Using a virtual environment keeps the project dependencies isolated from your system Python.
1. Open a terminal/command prompt and navigate to the project root directory (`capstone project`).
2. Create the environment:
   ```bash
   `python -m venv venv`
   # or on Mac/Linux you might need: python3 -m venv venv
   ```
3. Activate the environment:
   - **Windows:** `venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`

## 4. Install Dependencies
With your virtual environment activated, install all required libraries using the `requirements.txt` file:
```bash
pip install -r requirements.txt
```

## 5. Configure Environment Variables
( # you can skip this step if you copied this project from folder )
You need to set up the `.env` file for the unified backend server.

### A. Get your Gemini API Key
1. Go to [Google AI Studio (aistudio.google.com)](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click on **"Get API key"** in the sidebar.
4. Create a new API key and copy it.

### B. Django Secret Key (Development)
For local development you can use the default secret key that ships with the project:
```text
django-insecure-9^ojoibf^99kkea0-wulhumxl%=xm*+qicq&e#7amwg#dq1t-x
```

### C. Create the .env File
1. Navigate to the `"/Backend/placement_ml_project /"` directory.
2. Create a new file named `.env`.
3. Add your configuration inside the `.env` file:
   ```text
   GEMINI_API_KEY=your_actual_api_key_here
   SECRET_KEY=your_generated_secret_key_here
   DEBUG=True
   ```

## 6. Run the Backend Server
The project now runs on a single unified Django server.
1. Open a terminal, navigate to `"/Backend/placement_ml_project /"`
2. Ensure your virtual environment is activated.
3. Run database migrations:
   ```bash
   `python manage.py migrate`
   ```
4. Start the server:
   ```bash
  `python manage.py runserver`
   ```
   The server will start at `http://127.0.0.1:8000`.

## 7. Launch the Frontend
You can view the website locally without any additional frontend server:
1. Open your file explorer / Finder.
2. Navigate to the `Frontend` directory.
3. Double-click on `index.html` to open it in your web browser.
4. Ensure you have an active internet connection for the Gemini AI Chatbot and external CSS/JS libraries (like Google Fonts and Chart.js).

## Troubleshooting
- **Port already in use:** If you get an error when starting the server, ensure no other programs are using port 8000.
- **API Errors / No Response:** Check that your Django server is running without errors. Make sure your `GEMINI_API_KEY` is correct in the `.env` file and that you have an active internet connection.
- **Model File Missing:** Verify that the trained ML model file `placement_model.pkl` exists inside `Backend/placement_ml_project/predictor/model/`.
- **Database Issues:** If you encounter database errors, try running `python manage.py migrate` again.
s