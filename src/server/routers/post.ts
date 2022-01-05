import { createRouter } from 'server/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const postRouter = createRouter()
  // read
  .query('all', {
    async resolve({ ctx }) {
      return await ctx.prisma.blogPost.findMany({
        orderBy: {
            createdAt: "desc"
        }
      });
    },
  })
  // paginated
  .query('paginated', {
      input: z.object({
        limit: z.number().min(1).max(10).nullish(),
        cursor: z.string().nullable()
      }),
      async resolve({ ctx, input }) {
        const limit = input.limit ?? 50;
        const { cursor } = input;

        const items = await ctx.prisma.blogPost.findMany({
            take: limit,
            skip: 1,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: {
                createdAt: 'desc',
            },
        });
        
        const nextCursor: string | null = items.length > limit ? (items[limit - 1]?.id || null) : null;
        
        return {
          items,
          nextCursor,
        };

      },
  })

  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const post = await ctx.prisma.blogPost.findUnique({
        where: { id }
      });
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`,
        });
      }
      return post;
    },
  });
