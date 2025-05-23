# Stock Tracker

A web-based application designed for a high school programming seminar to help students learn about coding, stock tracking, and real-time data visualization using TypeScript and JavaScript.

## Overview

Stock Tracker allows users to search for stocks, view their latest prices, and watch price trends over time. This project is built as an educational tool, demonstrating how to work with APIs, manage state, and build interactive front-end interfaces.

## Features

- **Stock Search**: Find real-time data for a wide range of stocks.
- **Price Charting**: Visualize price trends with dynamic charts.
- **Watchlist**: Add stocks to a personal watchlist for quick reference.
- **Responsive Design**: Works well on both desktop and mobile devices.
- **Educational Code**: Codebase is structured for learning, with comments and logical separation of concerns.

## Technologies Used

- **TypeScript** (86.4%)
- **JavaScript** (13.6%)
- [React](https://react.dev/) (likely, if using a modern TypeScript setup)
- [Charting Library] (e.g., Chart.js or similar, if data visualization is present)
- [Stock Data API] (replace with actual provider, e.g., Alpha Vantage, Finnhub, or Yahoo Finance)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
git clone https://github.com/damiandrabek/stock-tracker.git
cd stock-tracker
npm install
```

### Running the App

```bash
npm start
```

This will start the development server. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Project Structure

```
src/
  components/      # React components (UI, charts, etc.)
  services/        # API calls and data fetching
  utils/           # Helper functions and utilities
  App.tsx          # Main application entry point
  index.tsx        # ReactDOM render
```

## Educational Notes

- The code is organized and commented for educational clarity.
- Key TypeScript and JavaScript concepts are demonstrated.
- Students are encouraged to tinker with features, add enhancements, and experiment!

## Contributing

Contributions are welcome, especially from students! Feel free to fork the repo, create pull requests, or open issues for feedback.

## License

This project is for educational use and is licensed under the MIT License.

---

**Created for the High School Programming Seminar.**