'use client';

import { useSession } from 'next-auth/react';
import { Spinner } from '@/components/ui/Spinner';
import Landing from '@/components/home/Landing';
import Dashboard from '@/components/home/Dashboard';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex h-dvh items-center justify-center bg-grid">
        <Spinner />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Landing />;
  }

  return <Dashboard email={session?.user?.email} />;
}