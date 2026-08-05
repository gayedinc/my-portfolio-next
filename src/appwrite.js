import { Query } from 'appwrite';

// Server-side Appwrite API helper
export const fetchFromAppwrite = async (method, path, body = null) => {
  const endpoint = process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  const headers = {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': projectId,
  };

  if (apiKey) {
    headers['X-Appwrite-Key'] = apiKey;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  let response = await fetch(`${endpoint}${path}`, options);

  // Some keys are missing scopes; retry as anonymous project request.
  if (response.status === 401 && apiKey) {
    const fallbackHeaders = {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': projectId,
    };

    const fallbackOptions = {
      method,
      headers: fallbackHeaders,
    };

    if (body) {
      fallbackOptions.body = JSON.stringify(body);
    }

    response = await fetch(`${endpoint}${path}`, fallbackOptions);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Appwrite API error ${response.status}: ${errorText || response.statusText}`);
  }

  return response.json();
};

export const getDesignProjects = async () => {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

  if (!databaseId) {
    throw new Error('Eksik Appwrite database ortam değişkeni');
  }

  const queryParams = new URLSearchParams();
  [
    Query.equal('projectType', ['uiux']),
    Query.equal('isFeatured', [true]),
    Query.orderAsc('displayOrder'),
  ].forEach((query) => queryParams.append('queries[]', query));

  const response = await fetchFromAppwrite(
    'GET',
    `/tablesdb/${databaseId}/tables/design_projects/rows?${queryParams.toString()}`
  );

  return response.rows;
};

const getCollectionDocuments = async (collectionId) => {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

  if (!databaseId || !collectionId) {
    throw new Error('Eksik Appwrite koleksiyon ortam değişkeni');
  }

  const response = await fetchFromAppwrite(
    'GET',
    `/databases/${databaseId}/collections/${collectionId}/documents`
  );

  return response.documents;
};

export const getProjects = async () => getCollectionDocuments(
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID
);

export const getArticles = async () => getCollectionDocuments(
  process.env.NEXT_PUBLIC_APPWRITE_ARTICLES_COLLECTION_ID
);

export const getAppwriteStorageFileUrl = (fileId) => {
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const endpoint = process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';

  if (!fileId || !bucketId || !projectId) {
    return null;
  }

  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
};
