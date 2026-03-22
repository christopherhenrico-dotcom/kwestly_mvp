import PocketBase from 'pocketbase';

const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://beneficial-strength-production-7d7b.up.railway.app';

export const pb = new PocketBase(PB_URL);

pb.autoCancellation(false);

export const getFileUrl = (collection: string, recordId: string, filename: string) => {
  return `${PB_URL}/api/files/${collection}/${recordId}/${filename}`;
};

export default pb;
