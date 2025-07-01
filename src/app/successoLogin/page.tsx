'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuccessLoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

useEffect(() => {
  const token = searchParams.get('token');
  const username = searchParams.get('username');
  const ruolo = searchParams.get('ruolo');
  const id = searchParams.get('id');

  console.log('Facebook login params:', { token, username, ruolo, id }); 

 if (token && ruolo && id) {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('username', username || 'UtenteFacebook'); 
  sessionStorage.setItem('ruolo', ruolo);
  sessionStorage.setItem('id', id);
  window.dispatchEvent(new Event('token-changed'));
  router.push('/');
}

}, []);


  return <div>Login in corso...</div>;
}
