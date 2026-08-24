# 1. Install dependencies
npm install

# 2. Create/sync the database (MySQL 8.0)
#    The DATABASE_URL in .env must point to a MySQL database that already exists.
#    Example: mysql://USER:PASSWORD@localhost:3306/ai_meeting_autopsy
npx prisma db push

# 3. Seed demo data (optional, for demo mode)
npx prisma db seed

# 4. Start the dev server
npm run dev
 npx
