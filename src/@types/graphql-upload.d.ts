// @types/graphql-upload is out of date

declare module 'graphql-upload/processRequest.mjs' {
  import type { IncomingMessage, ServerResponse } from 'http';

  export interface UploadOptions {
    maxFieldSize?: number | undefined;
    maxFileSize?: number | undefined;
    maxFiles?: number | undefined;
  }

  export interface GraphQLOperation {
    query: string;
    operationName?: null | string | undefined;
    variables?: null | unknown | undefined;
  }

  export default function processRequest(
    request: IncomingMessage,
    response: ServerResponse,
    uploadOptions?: UploadOptions
  ): Promise<GraphQLOperation | GraphQLOperation[]>;
}

declare module 'graphql-upload/Upload.mjs' {
  import type { ReadStream } from 'fs-capacitor';

  export interface FileUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream(): ReadStream;
  }

  export default class Upload {
    promise: Promise<FileUpload>;
    file?: FileUpload;
  }
}
