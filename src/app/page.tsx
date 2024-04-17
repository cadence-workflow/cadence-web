import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/domains');
  return null;
}
