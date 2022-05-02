import { useCallback, useEffect } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { ClientError, GraphQLClient } from 'graphql-request';
import { Sdk, getSdk } from '../../graphql/request-sdk';
import type {
  Template,
  TemplateFilter,
  TemplateImageRestriction,
  TemplateChange,
} from '../../graphql/request-sdk';

const client = new GraphQLClient('/api/graphql');
const sdk = getSdk(client);

async function request<T>(handler: (sdk: Sdk) => Promise<T>): Promise<T> {
  try {
    return await handler(sdk);
  } catch (e) {
    if (e instanceof ClientError && e.response.errors) throw e.response.errors[0].message;
    throw e;
  }
}

export type Query<T> = SWRResponse<T>;
export type ListQuery<T> = Omit<Query<T[]>, 'mutate'> & { atEnd: boolean };
export type Mutation<Args extends readonly unknown[], Ret> = (...args: Args) => Promise<Ret>;

export type { Template, TemplateFilter, TemplateImageRestriction };
export type TemplateHeader = Pick<Template, 'id' | 'name' | 'image'>;

export function useTemplateImageRestriction(): Query<TemplateImageRestriction> {
  return useSWR('supportedImage', () =>
    request(async sdk => (await sdk.templateImageRestriction()).restriction)
  );
}

export function useTemplate(id: string | null): Query<Template> {
  return useSWR(
    () => (id ? ['template', id] : null),
    (_, id) => request(async sdk => (await sdk.template({ id })).data)
  );
}

export function useTemplates(count: number, filter?: TemplateFilter): ListQuery<TemplateHeader> {
  const step = 20;
  const requiredPageCount = (count + step - 1) / step;
  const {
    data: pages,
    size: pageCount,
    setSize: setPageCount,
    mutate: _mutate,
    isValidating,
    ...query
  } = useSWRInfinite(
    (index, last) =>
      index == 0
        ? ['templates', null, filter || null]
        : last.length == step
        ? ['templates', last[last.length - 1].id, filter || null]
        : null,
    (_, after, filter) =>
      request(async sdk => (await sdk.templates({ first: step, after, filter })).list),
    { initialSize: requiredPageCount }
  );

  const data = pages ? pages.flat(1).slice(0, count) : undefined;
  const atEnd = (pages && pages.length && pages[pages.length - 1].length < step) || false;

  useEffect(() => {
    if (!isValidating && pageCount < requiredPageCount) setPageCount(requiredPageCount);
  }, [requiredPageCount, isValidating, pageCount, setPageCount]);

  return { data, atEnd, isValidating, ...query };
}

// NOTE: These Mutations currently do not need to be hooks, but they potentially depend on some context.

export function useDeleteUser(): Mutation<[id: string], boolean> {
  return useCallback(id => request(async sdk => (await sdk.deleteUser({ id })).ok), []);
}

export function useCreateTemplate(): Mutation<[name: string, image: Blob], string> {
  return useCallback(
    (name, image) => request(async sdk => (await sdk.createTemplate({ name, image })).id),
    []
  );
}

export function useUpdateTemplate(): Mutation<[id: string, change: TemplateChange], boolean> {
  return useCallback(
    (id, change) => request(async sdk => (await sdk.updateTemplate({ id, change })).ok),
    []
  );
}

export function useDeleteTemplate(): Mutation<[id: string], boolean> {
  return useCallback(id => request(async sdk => (await sdk.deleteTemplate({ id })).ok), []);
}
