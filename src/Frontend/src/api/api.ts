
export const API_BASE_URL = 'http://localhost:5213';

export default function fetchApi(request: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof request === 'string' ? request : request.toString();
  
    // If URL starts with '/', it's relative
    if (url.startsWith('/')) {
    const absoluteUrl = `${API_BASE_URL}${url}`;
    return fetch(absoluteUrl, init);
    }

    // If it's an absolute url, use as-is
    return fetch(request, init);
}