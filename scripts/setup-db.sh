#!/bin/bash

# Database setup script for Invoice SaaS

echo "Setting up database..."

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Push schema to database
echo "Pushing schema to database..."
npx prisma db push

echo "Database setup complete!"
echo ""
echo "To view your database in Prisma Studio, run:"
echo "  npm run db:studio"


