# Shortify URL Shortener

Shortify is a modern URL shortener built with Next.js, Supabase, React Query, Zustand, and ShadCN UI with Tailwind CSS. It allows users to create short, memorable links that redirect to long URLs.

## Features

- Create short URLs from long ones
- Track click counts on shortened URLs
- Copy to clipboard functionality
- Dark and light mode support
- Responsive design
- Modern UI with ShadCN UI components

## Tech Stack

- **Framework**: Next.js 15
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **API Layer**: React Query
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **Notifications**: Sonner
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20 or later
- Supabase account (free tier works fine)

### Environment Setup

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up your Supabase database by running the SQL in `supabase/migrations/01_create_urls_table.sql`

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Schema

The application uses a single table in Supabase:

**urls**

- `id` (UUID, primary key)
- `original_url` (TEXT)
- `short_id` (VARCHAR(10), unique)
- `created_at` (TIMESTAMPTZ)
- `clicks` (INT)

## Deployment

The easiest way to deploy this application is using Vercel:

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Add your environment variables
4. Deploy

## License

MIT
