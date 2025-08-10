import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  // Will add routers here later
})

export type AppRouter = typeof appRouter
