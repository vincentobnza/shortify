#!/bin/bash

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "Creating .env.local file with Supabase credentials"
  echo "NEXT_PUBLIC_SUPABASE_URL=https://ujvqnzoevjnoawkinypn.supabase.co" > .env.local
  echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqdnFuem9ldmpub2F3a2lueXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjAxMjcsImV4cCI6MjA2NDA5NjEyN30.3ATSPDwWW0d4E0I8Y8iaKQJUL2BN_EKoG2MP76AJLEY" >> .env.local
fi

# Run the development server
echo "Starting the development server..."
npm run dev
