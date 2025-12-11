### .env Configuration

### Installation

```bash
# From the project root
pnpm install
```

### Database Setup

```bash
cd apps/api
```

You need to create a `.env` file with your database configurations. A sample file is provided in the project as `.env.sample` - copy it and fill in your values:

```bash
cp .env.sample .env
```

Then edit the `.env` file with your database credentials and other required settings.

```bash
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

### Development

```bash
# From the project root (starts all services)
pnpm dev
```
