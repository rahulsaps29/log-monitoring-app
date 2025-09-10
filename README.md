
# Log Monitoring App

This app uses React + Typescript + Vite to build the log monitoring system.

## Features

- Log monitoring
- Responsive UI built with React and Vite
- TypeScript for type safety

## Getting Started

### Installation

```bash
git clone https://github.com/rahulsaps29/log-monitoring-app.git
cd log-monitoring-app
npm install
```

### Running the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

# Output logs

- Green blocks : Task which completed before 5 mins
- Yellow blocks : Task which completed after 5 mins and before 10 mins
- Red blocks : Task which took more that 10 mins
- Unmatched events : Task which started but never completed
  
![alt text](https://github.com/rahulsaps29/log-monitoring-app/blob/main/logsOutput.png)
