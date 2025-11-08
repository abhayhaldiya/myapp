# EMI Product Frontend Application

A modern React application for browsing smartphones and selecting EMI (Equated Monthly Installment) plans with dynamic pricing based on product variants and downpayment options.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Components](#components)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)

---

## 🛠️ Tech Stack

- **Framework:** React 19.2.0
- **Routing:** React Router DOM v7.9.5
- **HTTP Client:** Axios v1.13.2
- **Styling:** Custom CSS (Tailwind-inspired utility classes)
- **Build Tool:** Create React App (react-scripts 5.0.1)
- **Testing:** React Testing Library

### Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.5",
  "axios": "^1.13.2",
  "web-vitals": "^2.1.4"
}
```

---

## ✨ Features

### 1. Product Listing
- Display all available smartphones
- Show product images, prices, and variant counts
- Responsive card-based layout
- Click to view product details

### 2. Product Details Page
- **Variant Selection:**
  - Color variants with image switching
  - Storage options with price modifiers
  - Finish options (where applicable)
  
- **Dynamic Pricing:**
  - Base price updates based on selected variants
  - Real-time price calculation
  
- **Downpayment Options:**
  - 20% downpayment option
  - 40% downpayment option
  - Visual feedback on selection
  
- **EMI Plan Selection:**
  - Multiple tenure options (3, 6, 9, 12 months)
  - Interest rate display
  - Cashback information
  - Dynamic EMI calculation based on downpayment
  
- **Price Breakdown:**
  - Product price
  - Downpayment amount
  - Amount to be financed
  - Interest amount per plan
  - Total amount payable

### 3. Dynamic EMI Calculation
- Calculates EMI using compound interest formula
- Updates automatically when:
  - Variant is changed
  - Downpayment is selected
  - EMI plan is changed

### 4. Image Gallery
- Main product image display
- Thumbnail gallery for quick navigation
- Image changes based on color selection
- Smooth transitions

### 5. Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd myapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env` file in the myapp directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Add product images:**
   
   Place product images in `public/images/products/`:
   ```
   public/images/products/
   ├── iphone-silver.jpg
   ├── iphone-black.jpg
   ├── iphone-gold.jpg
   ├── iphone-purple.jpg
   ├── samsung-black.jpg
   ├── samsung-gray.jpg
   └── samsung-white.jpg
   ```

5. **Start the development server:**
   ```bash
   npm start
   ```

6. **Open browser:**
   
   Navigate to: `http://localhost:3000`

---

## 📁 Project Structure

```
myapp/
├── public/
│   ├── images/
│   │   └── products/          # Product images
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Loader.jsx         # Loading spinner
│   │   ├── ProductCard.jsx    # Product card component
│   │   └── EMIPlanCard.jsx    # EMI plan card (legacy)
│   ├── pages/
│   │   ├── HomePage.jsx       # Product listing page
│   │   └── ProductPage.jsx    # Product details page
│   ├── App.jsx                # Main app with routing
│   ├── index.js               # Entry point
│   ├── index.css              # Global styles
│   └── reportWebVitals.js
├── .env                       # Environment variables
├── package.json
└── README.md
```

---

## 🧩 Components

### 1. App.jsx
Main application component with routing setup.

```jsx
<Router>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/products/:slug" element={<ProductPage />} />
  </Routes>
</Router>
```

### 2. HomePage.jsx
Displays all products in a grid layout.

**Features:**
- Fetches products from API
- Loading state
- Error handling
- Responsive grid layout

**API Call:**
```javascript
GET http://localhost:5000/api/products
```

### 3. ProductPage.jsx
Detailed product view with variant selection and EMI calculator.

**Features:**
- Variant selection (color, storage, finish)
- Dynamic price calculation
- Downpayment selection
- EMI plan selection with radio buttons
- Price breakdown
- Image gallery

**State Management:**
```javascript
const [product, setProduct] = useState(null);
const [selectedVariants, setSelectedVariants] = useState({
  color: null,
  storage: null,
  finish: null
});
const [selectedDownpayment, setSelectedDownpayment] = useState(20);
const [selectedEMIPlan, setSelectedEMIPlan] = useState(null);
const [currentImage, setCurrentImage] = useState(null);
```

**API Call:**
```javascript
GET http://localhost:5000/api/products/:slug
```

**EMI Calculation Formula:**
```javascript
// For 0% interest
EMI = Principal / Tenure

// For interest-based plans
EMI = P × r × (1+r)^n / ((1+r)^n - 1)
where:
  P = Principal (remaining amount after downpayment)
  r = Monthly interest rate (annual rate / 12 / 100)
  n = Number of months
```

### 4. ProductCard.jsx
Reusable product card component.

**Props:**
```javascript
{
  product: {
    name: String,
    baseVariant: String,
    price: Number,
    mrp: Number,
    image: String,
    slug: String,
    variants: Object,
    emiPlans: Array
  }
}
```

### 5. Loader.jsx
Loading spinner component.

**Usage:**
```jsx
{loading && <Loader />}
```

---

## 🔧 Environment Variables

Create a `.env` file in the myapp directory:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000
```

**Note:** Environment variables must start with `REACT_APP_` to be accessible in React.

---

## 📜 Scripts

```bash
# Start development server (http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (one-way operation)
npm run eject
```

---

## 🎨 Styling

The application uses custom CSS with utility classes inspired by Tailwind CSS.

### Key Style Features:
- Utility-first CSS approach
- Responsive design utilities
- Hover and transition effects
- Color scheme: Teal/Cyan for primary actions
- Gradient backgrounds for EMI cards (legacy)

### Main Colors:
```css
Primary: #0D9488 (Teal-600)
Secondary: #ECFEFF (Cyan-50)
Success: #22C55E (Green-500)
Text: #111827 (Gray-900)
Background: #F9FAFB (Gray-50)
```

---

## 🔄 Data Flow

### 1. Product Listing Flow
```
HomePage → API Call → Display Products → Click Product → Navigate to ProductPage
```

### 2. Product Detail Flow
```
ProductPage → API Call → Load Product Data → 
  ↓
Set Default Variants → 
  ↓
User Selects Variant → Update Price → 
  ↓
User Selects Downpayment → Calculate Remaining Amount →
  ↓
User Selects EMI Plan → Calculate Monthly EMI →
  ↓
Display Price Breakdown
```

### 3. Image Update Flow
```
User Selects Color → Find Color Variant → 
  ↓
Get Image URL → Update Current Image → Display New Image
```

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Files
- `App.test.js` - Basic app rendering test
- `setupTests.js` - Jest DOM configuration

### Testing Libraries
- `@testing-library/react` - React component testing
- `@testing-library/jest-dom` - Custom Jest matchers
- `@testing-library/user-event` - User interaction simulation

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
Default: < 640px

/* Tablet */
sm: 640px

/* Desktop */
md: 768px
lg: 1024px

/* Large Desktop */
xl: 1280px
```

---

## 🐛 Troubleshooting

### Cannot Connect to Backend
```bash
# Check if backend is running
curl http://localhost:5000

# Verify REACT_APP_API_URL in .env
# Restart frontend after changing .env
```

### Images Not Loading
```bash
# Check if images exist in public/images/products/
# Verify image paths in database
# Clear browser cache (Ctrl + Shift + R)
```

### Blank Page
```bash
# Check browser console (F12) for errors
# Verify all imports are correct
# Check if backend API is accessible
```

### Port 3000 Already in Use
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm start
```

---

## 🚀 Build for Production

```bash
# Create optimized production build
npm run build

# Output directory: build/
# Deploy the build folder to your hosting service
```

### Deployment Options:
- **Vercel:** `vercel deploy`
- **Netlify:** Drag & drop build folder
- **GitHub Pages:** Use gh-pages package
- **AWS S3:** Upload build folder

---

## 📊 Performance

### Optimizations:
- Code splitting with React.lazy (can be added)
- Image optimization (use WebP format)
- Memoization with React.memo (can be added)
- Lazy loading for images
- Production build minification

---

## 🔐 Security

### Best Practices Implemented:
- Environment variables for API URLs
- No sensitive data in frontend code
- CORS enabled on backend
- Input validation on backend
- Error handling for API calls

---

## 📝 License

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

---

## 👤 Author

EMI Product Application Frontend

---

## 🔗 Related Documentation

- [Backend README](../server/README.md)
- [Setup Guide](../START_HERE.md)
- [Variant Update Guide](../VARIANT_UPDATE_GUIDE.md)
- [Image Fix Guide](../IMAGE_FIX_GUIDE.md)
