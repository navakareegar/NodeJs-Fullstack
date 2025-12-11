### Installation

```bash
# From the project root
pnpm install
```

### Database Setup

```bash
cd apps/api
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

### Development

```bash
# From the project root (starts all services)
pnpm dev
```
