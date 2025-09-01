# Keyboard Warrior

AI-Powered Argument Assistant - Craft compelling responses during arguments or debates with AI assistance.

## Features

- **Context-Aware Response Generation**: Input argument details for relevant AI responses
- **Multiple AI Personality Tones**: Choose from 8 different tones (calm, aggressive, cunning, etc.)
- **Style Emulation**: Upload examples of your writing for personalized responses
- **Natural Language Generation**: Avoids typical AI patterns for authentic-sounding responses
- **Response Management**: Save, organize, and manage argument contexts
- **Privacy-Focused**: Secure data handling with optional anonymous usage

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite (development), PostgreSQL (production)
- **AI Integration**: OpenAI API (or compatible LLM service)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm run install:all
```

3. Configure environment variables:
   - Copy `backend/.env` and update with your API keys
   - Set `OPENAI_API_KEY` for AI functionality

4. Run development servers:
```bash
npm run dev
```

This starts both frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

## Development

- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && npm run dev`
- Build: `npm run build`
- Test: `npm run test`

## Project Structure

```
keyboard-warrior/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── context/       # React context providers
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
├── backend/               # Node.js backend API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── config/        # Configuration
│   │   └── types/         # TypeScript types
└── database/              # Database files
```

## API Endpoints

- `POST /api/generate-responses` - Generate AI responses
- `GET /api/arguments` - Get saved arguments
- `POST /api/arguments` - Create new argument
- `GET /api/arguments/:id` - Get specific argument
- `DELETE /api/arguments/:id` - Delete argument

## License

MIT