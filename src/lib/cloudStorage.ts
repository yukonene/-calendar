import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.GCP_SERVICE_ACCOUNT_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_SERVICE_ACCOUNT_CLIENT_EMAIL,
    private_key: process.env.GCP_SERVICE_ACCOUNT_PRIVATE_KEY?.split(
      String.raw`\n`
    ).join('\n'),
    // private_key: process.env.GCP_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    //   /\\n/g,
    //   '\n'
    // ),
  },
});
export const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '');
