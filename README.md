# Zero Cost Paper Trading Simulator

A full-stack "Paper Trading" application where users can simulate buying and selling stocks with virtual currency using real-time market data.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Recharts
- Axios

**Backend:**
- Node.js & Express
- Passport.js (Google OAuth)
- JWT (JSON Web Tokens)

**Database:**
- MongoDB (Mongoose)

**Data Sources:**
- Finnhub API (Real-time prices)
- Yahoo Finance (Historical data & charts)

## 📁 Folder Structure

```text
├── Backend/          # Node.js & Express API, MongoDB models, Passport config
├── Frontend/         # React (Vite) application, UI components
├── api/              # Vercel serverless entry point
├── package.json      # Root maintenance scripts
└── vercel.json       # Vercel deployment configuration
```

##  How to Run

### 1. Setup
Run the following command in the root directory to install all dependencies:
```bash
npm run setup
```

### 2. Run Backend
```bash
cd Backend
npm run dev
```

### 3. Run Frontend
```bash
cd Frontend
npm run dev
```
The application will be available at `http://localhost:5173`.
