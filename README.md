# Compatrade

A modern cryptocurrency trading platform built with Next.js 15, featuring real-time data, advanced trading tools, and a responsive design optimized for all devices.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## ⚡ Tech Stack

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Reusable UI components
- **[Clerk](https://clerk.com/)** - Authentication and user management
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe database toolkit
- **[tRPC](https://trpc.io/)** - End-to-end typesafe APIs
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management
- **[Vitest](https://vitest.dev/)** - Testing framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── [features]/     # Feature-specific components
├── server/             # tRPC API routes and database
│   ├── api/           # API routers
│   └── db/            # Database schema and config
├── lib/                # Utility functions
├── hooks/              # Custom React hooks
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
└── styles/             # Global CSS and Tailwind config
```

## 🎯 Features

### Trading Interface

- **Real-time Charts** - Interactive price charts with multiple timeframes
- **Order Book** - Live bid/ask data with depth visualization
- **Trade Panel** - Buy/sell orders with advanced options
- **Portfolio Management** - Track positions and P&L

### Advanced Tools

- **AI Assistant** - Trading insights and market analysis
- **Strategy Builder** - Create and backtest trading strategies
- **Analytics Dashboard** - Performance metrics and reporting

### Responsive Design

- **Mobile-First** - Optimized for all screen sizes (320px to 4K+)
- **Touch-Friendly** - 44px+ touch targets and smooth interactions
- **Container Queries** - Components adapt to available space
- **Persistent Navigation** - Bottom navigation visible on all devices

## 📝 Available Scripts

- `yarn dev` - Start development server with Turbopack
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint errors
- `yarn type-check` - Run TypeScript compiler
- `yarn test` - Run tests
- `yarn test:watch` - Run tests in watch mode
- `yarn format` - Format code with Prettier

## 🚀 Deployment

### Automated VPS Deployment

The project includes GitHub Actions for automated deployment to your VPS.

#### Prerequisites

- VPS with Docker installed
- Traefik reverse proxy
- Domain with A record pointing to your VPS

#### Setup

1. **Configure GitHub Secrets** in your repository settings:

   ```
   VPS_HOST                           # Your VPS IP address
   VPS_USER                          # SSH username
   VPS_SSH_KEY                       # Private SSH key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY # Clerk public key
   CLERK_SECRET_KEY                  # Clerk secret key
   NEXTAUTH_SECRET                   # NextAuth secret
   DATABASE_URL                      # Database connection string
   UPSTASH_REDIS_REST_URL           # Redis URL
   UPSTASH_REDIS_REST_TOKEN         # Redis token
   OPENAI_API_KEY                   # OpenAI API key
   ```

2. **Update Domain** in `.github/workflows/deploy.yml`

3. **Deploy** by pushing to `main` branch

### Alternative Platforms

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Deploy with build command `yarn build` and publish directory `out`
- **Docker**: Use the included `Dockerfile` for containerized deployment

## 🔧 Configuration

### Environment Variables

Create `.env.local` based on `.env.example`:

```bash
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXTAUTH_SECRET=

# Database
DATABASE_URL=

# Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# AI
OPENAI_API_KEY=
```

### Development

- Hot reload with Turbopack
- TypeScript strict mode enabled
- ESLint + Prettier configured
- Husky pre-commit hooks

## 🧪 Testing

```bash
# Run all tests
yarn test

# Watch mode
yarn test:watch

# UI mode
yarn test:ui
```

Tests include:

- Component unit tests
- Integration tests
- Type checking
- Linting validation

## 📱 Performance

- **Dynamic Imports** - Lazy loading for advanced components
- **Image Optimization** - Next.js automatic image optimization
- **Code Splitting** - Automatic bundle splitting
- **Tree Shaking** - Remove unused code
- **Container Queries** - Efficient responsive design

## 🎨 UI/UX Features

- **Dark Theme** - Consistent dark mode design
- **Smooth Animations** - Framer Motion powered transitions
- **Accessible** - WCAG 2.1 compliance
- **Touch Optimized** - Mobile gesture support
- **Loading States** - Skeleton loaders and suspense boundaries

## 🔒 Security

- **Authentication** - Secure user sessions with Clerk
- **CSRF Protection** - Built-in Next.js protections
- **Input Validation** - Zod schema validation
- **Rate Limiting** - API endpoint protection
- **Security Headers** - Configured in `next.config.ts`

---

Built with modern web technologies for a premium trading experience.
