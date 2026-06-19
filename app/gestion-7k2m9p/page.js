import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verificarTokenAdmin, nombreCookie } from '../api/_lib/admin-auth.js';

export const metadata = {
  title: 'Gestión — Estancia San Francisco',
  robots: 'noindex, nofollow',
};

export default function GestionRoot() {
  const cookieStore = cookies();
  const token = cookieStore.get(nombreCookie())?.value;
  const payload = token ? verificarTokenAdmin(token) : null;

  if (payload) {
    redirect('/gestion-7k2m9p/dashboard');
  } else {
    redirect('/gestion-7k2m9p/login');
  }
}
