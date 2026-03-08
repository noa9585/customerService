export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT', e);
    return null;
  }
}

export default parseJwt;

// Try to normalize/resolve a user's name from a decoded JWT payload.
export function getNameFromPayload(payload: any): string | null {
  if (!payload) return null;
  // Common claim keys that may contain the name
  const keys = [
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
    'name',
    'unique_name',
    'given_name',
    'nameCust',
    'email', // fallback to email
    'sub'
  ];

  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(payload, k) && payload[k]) {
      return payload[k];
    }
  }
  return null;
}

export function getNameFromToken(token: string | null | undefined): string | null {
  if (!token) return null;
  const payload = parseJwt(token);
  return getNameFromPayload(payload);
}

