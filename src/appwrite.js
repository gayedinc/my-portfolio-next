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