# 🌦️ Weather Dashboard (React + Vite)

A modern, fast, and responsive Weather Dashboard built using **React 18 + Vite**, designed to display real-time weather data, hourly forecasts, and historical insights with a clean UI.

---

## 🚀 Features

* 🌡️ **Current Weather**

  * Temperature
  * Humidity
  * Precipitation
  * Min / Max Temperature
  * Weather condition icons

* ⏱️ **Hourly Forecast (24 Hours)**

  * Temperature trends
  * Weather conditions
  * Wind speed & visibility

* 📊 **Historical Weather**

  * Date range selection
  * Temperature trends (charts)
  * Precipitation & wind insights

* 🌫️ **Air Quality Index**

  * PM2.5, PM10
  * CO, NO₂, SO₂
  * AQI visualization

* 🌙 **Dark Mode**

  * Smooth toggle using theme provider

* ⚡ **Performance Optimized**

  * API caching using TanStack Query
  * Fast load time (<500ms target)

* 📱 **Fully Responsive**

  * Mobile, tablet, and desktop friendly

---

## 🛠️ Tech Stack

* **Frontend:** React 18 + Vite
* **State & Data Fetching:** TanStack Query
* **UI Library:** shadcn/ui
* **Charts:** Recharts
* **Icons:** lucide-react
* **Styling:** Tailwind CSS
* **Theme:** next-themes

---

## 📁 Project Structure

```
src/
│
├── components/
│   ├── ui/                # Reusable UI components (shadcn)
│   ├── weather/           # Weather related components
│   │   ├── weather-summary.jsx
│   │   ├── hourly-charts.jsx
│   │   ├── historical-charts.jsx
│   │   ├── air-quality-display.jsx
│   │   └── data-range-picker.jsx
│   ├── provider.jsx
│   └── theme-toggle.jsx
│
├── lib/
│   ├── hooks/             # Custom hooks (API logic)
│   │   ├── useWeather.js
│   │   ├── useHistoricalWeather.js
│   │   ├── useAirQuality.js
│   │   └── useGeolocation.js
│   ├── utils/             # Utility functions
│   │   ├── api.js
│   │   └── weather.js
│
├── pages/
│   ├── Home.jsx
│   └── History.jsx
│
├── App.jsx
└── main.jsx
```

---

## 🌐 API Used

* Open-Meteo Weather API
* Air Quality API
* Historical Weather API

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

## 📦 Build for Production

```bash
npm run build
```

---

## 🧠 Architecture Overview

* **Custom Hooks** handle all API logic

* **TanStack Query** manages caching:

  * Current Weather → 5 min
  * Hourly Forecast → 30 min
  * Historical Data → 1 hour

* **Component-based design**

  * Reusable UI
  * Clean separation of concerns

---

## 🎯 Performance Optimizations

* API caching (reduces network calls)
* Lazy loading of components
* Efficient state management
* Minimal re-renders

---

## 📸 UI Highlights

* Clean card-based layout
* Tab-based navigation (Current / Hourly / Historical)
* Smooth transitions
* Modern dashboard look

---

## 🧩 Future Improvements

* 📍 Search by city
* ⭐ Favorite locations
* 🌍 Multi-location support
* 📊 More advanced analytics

---

## 🙌 Author

**Kanishk Rawat**

---

## 📄 License

This project is open-source and free to use.

---

🔥 *Built for performance, scalability, and clean UI experience.*
