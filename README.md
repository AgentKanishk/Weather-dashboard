# 🌦️ Weather Dashboard (React + Vite)

A modern, fast, and responsive Weather Dashboard built using **React 18 + Vite**, designed to display real-time weather data, hourly forecasts, air quality metrics, and historical insights with a clean UI.

---

## 🚀 Features

* 🌡️ **Current Weather**

  * Temperature (Current, Min, Max)
  * Humidity
  * Precipitation
  * Wind Speed
  * Sunrise & Sunset

* ⏱️ **Hourly Forecast (24 Hours)**

  * Temperature trends
  * Humidity
  * Precipitation
  * Wind Speed
  * Visibility

* 🌫️ **Air Quality Index**

  * AQI (European Index)
  * PM2.5, PM10
  * CO, NO₂, SO₂

* 📊 **Historical Weather**

  * Date range selection (up to 2 years)
  * Temperature trends (Min, Max, Mean)
  * Precipitation & wind data

* 🌙 **Dark Mode**

* 📱 **Fully Responsive UI**

* ⚡ **Fast Performance with caching**

---

## 🛠️ Tech Stack

* **Frontend:** React 18 + Vite
* **Data Fetching:** TanStack Query
* **UI Components:** shadcn/ui
* **Charts:** Recharts
* **Icons:** lucide-react
* **Styling:** Tailwind CSS

---

## 📁 Project Structure

```bash
src/
├── components/
│   ├── ui/
│   ├── weather/
│   ├── charts/
│   ├── common/
│   └── provider.jsx
│
├── lib/
│   ├── hooks/
│   ├── utils/
│   └── api.js
│
├── pages/
│   ├── Home.jsx
│   └── History.jsx
│
├── App.jsx
└── main.jsx
```

---

## 🌐 APIs Used

* Open-Meteo Weather API
* Open-Meteo Air Quality API
* Open-Meteo Historical API

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/weather-dashboard.git
cd weather-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

App will run on:

```
http://localhost:5173
```

---

## 🚀 Deployment

This project is deployed using **Vercel** for fast and reliable hosting.

### 🔗 Live Demo

👉 https://weather-dashboard-pearl-three.vercel.app/

### 🧩 Deployment Steps

1. Push your project to GitHub
2. Go to Vercel and login with GitHub
3. Import your repository
4. Configure build settings:

   * Build Command: `npm run build`
   * Output Directory: `dist`
5. Click **Deploy**

---

## ⚡ Performance Optimizations

* API caching with TanStack Query
* Minimal re-renders
* Optimized data fetching
* Fast initial load (<500ms target)

---

## 🎨 UI Highlights

* Modern dashboard layout
* Responsive grid system
* Card-based design
* Interactive charts
* Clean typography

---

## 🧠 Architecture

* Custom hooks for API handling
* Separation of concerns (data vs UI)
* Modular component structure

---

## 🧩 Future Improvements

* Location search
* Multiple cities support
* Advanced analytics
* Notifications

---

## 🙌 Author

**Kanishk Rawat**

---

## 📄 License

This project is open-source and free to use.

---

🔥 *Built with focus on performance, scalability, and clean UI experience.*
