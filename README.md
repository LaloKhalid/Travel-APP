# 🌍 Travel App (Reseapp)

A React travel app that fetches data from APIs and presents countries in a **clear, user-friendly, and accessible way**.  

The app features a paginated list of countries on the homepage with a search field and continent buttons (region filters). Each country opens a detailed page showing **basic info, current weather, and images**.


---

## 💡 About
This project was created as a final assignment for the course JavaScript-3 at Grit Academy.
The goal was to build a **React-based travel app** using APIs to fetch country data, weather, and images, while ensuring **accessibility and responsiveness**.  
---

## ✨ Features
- 🔍 Search field to find specific countries  
- 🌐 Paginated list of countries (10–20 per page)  
- 🗺️ Continent filter buttons: Africa, Americas, Asia, Europe, Oceania, Antarctic + All  
- 🏳️ Each country detail page includes:
  - Flag (with meaningful alt text)  
  - Name and official name (if available)  
  - Region / Subregion  
  - Capital (if available)  
  - Population, language, currency  
  - Current weather (from Open-Meteo/OpenWeather)  
  - At least 3 images (Unsplash/Pexels)  
  - Short intro text (Wikipedia summary) with source  
- 🔄 Pagination with next/previous buttons and page indicators  
- ⏳ Loading skeleton/spinner  
- ❌ Error handling with clear messages and retry button  
- ♿ Accessibility: semantic HTML, alt texts, aria-labels, keyboard navigation  
- 📱 Responsive design (mobile-first, minimum 2 breakpoints)
---

🎮 Usage
- Search for countries using the search field.
- Filter by continent using the continent buttons.
- Navigate pages using the pagination buttons.
- Click a country to see detailed information, current weather, and images.
- Use the “Back” button to return to the country list.

---

🧰 Built With

⚛️ React (Vite or Next.js)
🧭 React Router v6+
💎 TypeScript
🖌️ Tailwind CSS
🔄 TanStack Query
☁️ Netlify (optional)