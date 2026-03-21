import PocketBase from 'pocketbase';

const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(PB_URL);

// Export the base URL for file URLs
export const getFileUrl = (collection: string, recordId: string, filename: string) => {
  return `${PB_URL}/api/files/${collection}/${recordId}/${filename}`;
};

export default pb;
