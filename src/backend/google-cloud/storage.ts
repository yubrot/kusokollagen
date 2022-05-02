import { Storage } from '@google-cloud/storage';

const credentials = JSON.parse(process.env.GOOGLE_CLOUD_STORAGE_KEY!);
const storage = new Storage({ credentials });

export default storage;
