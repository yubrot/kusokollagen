import stream from 'stream';

export class SizeLimitter extends stream.Transform {
  private length = 0;

  constructor(readonly limit: number, src: stream.Readable, dest: stream.Writable) {
    super();

    this.on('error', e => {
      src.destroy(e);
      dest.destroy(e);
    });
  }

  _transform(chunk: any, _encoding: BufferEncoding, callback: stream.TransformCallback): void {
    this.length += chunk.length;

    if (this.length > this.limit) {
      this.destroy(new Error('Size limit exceeded'));
      return;
    }

    this.push(chunk);
    callback();
  }
}
