# 🐾 PetPal – Fullstack Pet Adoption Platform

PetPal is a fullstack web application designed to simplify pet adoption by connecting users with available pets, managing adoption requests, and providing a seamless user experience.

---

## 🚀 Features

* 🔐 User Authentication (Login / Register)
* 🐶 Browse Available Pets
* 📂 Categorized Listings
* ❤️ Adoption Request System
* 🧑‍💼 Admin Management (optional based on backend)
* 🎨 Consistent UI using custom theme

---

## 🏗️ Tech Stack

### Frontend

* React (Vite / CRA)
* CSS / Theme-based styling (from `/public/theme`)
* Axios / Fetch for API calls

### Backend

* Django
* Django REST Framework

### Database

* SQLite (default) / configurable

---

## 📁 Project Structure

```
PetPal/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   ├── public/
│   │   └── theme/
│
├── backend/
│   ├── core/
│   ├── users/
│   ├── pets/
│   ├── adoption/
│   ├── categories/
│
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/petpal.git
cd petpal
```

---

### 2️⃣ Backend Setup (Django)

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

Apply migrations:

```bash
python manage.py migrate
```

Run server:

```bash
python manage.py runserver
```

---

### 3️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev   # or npm start
```

---

## 🔌 API Integration

* Base URL: `http://127.0.0.1:8000/api/`
* Ensure frontend API calls match backend endpoints
* Auth handled via (JWT / Session — update based on your setup)

---

## 🎨 Theme Usage

* UI styling is based on files inside:

  ```
  frontend/public/theme/
  ```
* Avoid overriding theme styles unnecessarily
* Maintain consistency across all components

---

## 🔐 Environment Variables

Create `.env` files where necessary:

### Backend:

```
SECRET_KEY=your_secret_key
DEBUG=True
```

### Frontend:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 🧪 Testing (Optional)

* Backend: Django test framework
* Frontend: React testing libraries

---

## 🚀 Deployment (Basic Idea)

* Frontend: Vercel / Netlify
* Backend: Render / Railway / VPS
* Database: PostgreSQL (recommended for production)

---

## ⚠️ Important Notes

* Do NOT commit `.env` files
* Do NOT upload `node_modules/`
* Ensure consistent API contracts between frontend & backend

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch (`feature/your-feature`)
3. Commit changes
4. Push and create PR

---

## 📌 Future Improvements

* Real-time notifications
* Advanced filtering
* Admin dashboard enhancements
* Image upload optimization

---

## 👨‍💻 Author

Kirtan Tanti

---

## 📄 License

This project is for educational purposes.
