import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import superjson from 'superjson'
import { ZodError } from 'zod'

// Mock auth for now - will be replaced with real auth later
interface MockAuth {
  userId?: string
}

function mockAuth(req: any): MockAuth {
  // Mock implementation - in real app would use Clerk or NextAuth
  return { userId: 'mock-user-id' }
}

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req } = opts
  const auth = mockAuth(req)

  return {
    userId: auth.userId,
    ...opts,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

// Middleware to ensure authentication
const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      userId: ctx.userId,
    },
  })
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(enforceAuth)
