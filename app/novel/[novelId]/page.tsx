// app/novel/[novelId]/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import NovelDashboard from '@/components/novel/NovelDashboard';

export default function NovelDetailsPage() {
  const { status } = useSession();
  const router = useRouter();
  const { novelId } = useParams<{ novelId: string }>();

  if (status === 'loading') {
    return <div className="flex h-dvh items-center justify-center bg-grid"><Spinner /></div>;
  }

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  return <NovelDashboard novelId={novelId} />;
}