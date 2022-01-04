import { createRouter } from 'server/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const postRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      id: z.string().uuid(),
      title: z.string().min(5).max(255),
      content: z.string().min(10),
      createdAt: z.date().default(new Date()),
      published: z.boolean().default(false),
      authorId: z.string().uuid()
    }),
    async resolve({ ctx, input }) {
      const post = await ctx.prisma.blogPost.create({
        data: input,
      });
      return post;
    },
  })
  // read
  .query('all', {
    async resolve({ ctx }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return ctx.prisma.blogPost.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true
        },
      });
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const post = await ctx.prisma.blogPost.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true
        },
      });
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`,
        });
      }
      return post;
    },
  })
  // update
  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        title: z.string().min(5).max(255).optional(),
        content: z.string().min(1).optional(),
        updatedAt: z.date().default(new Date())
      }),
    }),
    async resolve({ ctx, input }) {
      const { id, data } = input;
      const post = await ctx.prisma.blogPost.update({
        where: { id },
        data,
      });
      return post;
    },
  })
  // delete
  .mutation('delete', {
    input: z.string().uuid(),
    async resolve({ input: id, ctx }) {
      await ctx.prisma.blogPost.delete({ where: { id } });
      return id;
    },
  });