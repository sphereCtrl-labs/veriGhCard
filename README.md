# veriGhCard

A mobile application for verifying Ghanaian identity cards, built with Expo and React Native.

## Features

- Card number verification
- Simple and intuitive form interface
- Real-time verification status feedback

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

## Environment Variables

This project uses environment variables for API configuration. Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your API credentials:

- `EXPO_PUBLIC_API_BASE_URL` - The API endpoint URL
- `EXPO_PUBLIC_API_CHANNEL_ID` - The channel ID for the API

## Running the App

- **Android Emulator**: Press `a` in the terminal
- **iOS Simulator**: Press `i` in the terminal
- **Web**: Press `w` in the terminal

## Project Structure

```
veriGhCard/
├── api/                 # API functions
├── app/                 # App screens and routing
├── components/         # Reusable UI components
├── constants/          # App constants and theme
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## License

MIT
