import typeDefs from '../../graphql/schema.graphql';
import * as sig from '../../graphql/resolvers-signatures';
import * as backend from '../../backend';
import { ApolloServer, ForbiddenError, UserInputError } from 'apollo-server-micro';
import { processRequest } from 'graphql-upload';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

class GqlContext implements backend.Context {
  constructor(private readonly req: NextApiRequest) {}

  private operatorCache?: backend.Operator | null;

  async operator(): Promise<backend.Operator | null> {
    if (this.operatorCache !== undefined) return this.operatorCache;
    const session = await getSession({ req: this.req });
    this.operatorCache = session ? { id: session.user.id, role: session.user.role } : null;
    return this.operatorCache;
  }

  inputError(message: string): never {
    throw new UserInputError(message);
  }

  forbiddenError(message: string): never {
    throw new ForbiddenError(message);
  }
}

const Query: sig.QueryResolvers<GqlContext> = {
  templateImageRestriction(_parent, _args, _ctx) {
    return backend.templateImageRestriction;
  },

  async template(_parent, { id }, ctx) {
    const t = await backend.getTemplate(id, ctx);
    const operator = await ctx.operator();
    return adapter.template(t, operator);
  },

  async templates(_parent, { first, after, filter }, ctx) {
    const ls = await backend.getTemplates(first, after || null, filter || null, ctx);
    const operator = await ctx.operator();
    return ls.map(t => adapter.template(t, operator));
  },
};

const Mutation: sig.MutationResolvers<GqlContext> = {
  async deleteUser(_parent, { id }, ctx) {
    // CSRF protection depends on the fact that SameSite=Lax
    await backend.deleteUser(id, ctx);
    return true;
  },

  async createTemplate(_parent, { name, image }, ctx) {
    return backend.createTemplate(name, await image.promise, ctx);
  },

  async updateTemplate(_parent, { id, change }, ctx) {
    return backend.updateTemplate(id, await adapter.templateChange(change), ctx);
  },

  async deleteTemplate(_parent, { id }, ctx) {
    return backend.deleteTemplate(id, ctx);
  },
};

const apolloHandler = (async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers: { Query, Mutation },
    context: ({ req }) => new GqlContext(req),
  });
  await server.start();
  return server.createHandler({ path: '/api/graphql' });
})();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.startsWith('multipart/form-data')) {
    (req as any).filePayload = await processRequest(req, res);
  }
  return (await apolloHandler)(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// adapter between backend.* and sig.*
const adapter = {
  async templateChange({
    name,
    accessibility,
    image,
    ...content
  }: sig.TemplateChange): Promise<backend.TemplateChange> {
    return {
      name,
      accessibility,
      image: image ? await image.promise : undefined,
      content,
    };
  },

  template(
    { id, name, accessibility, image, content, ownerId }: backend.Template,
    operator: backend.Operator | null
  ): sig.Template {
    return {
      id,
      name,
      accessibility,
      image: backend.templateImagePublicUrl(image),
      owned: ownerId == operator?.id,
      ...content,
    };
  },
};
