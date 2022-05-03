import util from 'util';
import stream from 'stream';

// FIXME: In node v15, 'stream/promises' are available.
export const pipeline = util.promisify(stream.pipeline);
