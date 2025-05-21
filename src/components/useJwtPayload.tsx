// Nel file useJwtPayload.ts (o dove si trova)
import { useState, useEffect } from 'react';

export interface UserInfo {
  id: string;
  ruolo: string;
  username?: string;
  email: string;
  // ...altre proprietà del payload
}

export function useJwtPayload(): UserInfo | null {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setUserInfo(null);
      return;
    }
    try {
      //decode base64 senza librerie esterne
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload) as UserInfo;
      setUserInfo(payload);
    } catch {
      setUserInfo(null);
    }
  }, []);

  return userInfo;
}
