'use client';

import { useSession, signIn } from 'next-auth/react';
import { Spinner } from '@/components/ui/Spinner';
import { Dashboard } from '@/components/dashboard/Dashboard';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex h-dvh items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <Spinner />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex h-dvh items-center justify-center bg-grid px-4">
        <div className="w-full max-w-110 border-[3px] border-black bg-white p-10 text-center shadow-[5px_5px_0px_black] max-[480px]:p-6">
          <div className="mb-6 inline-block border-2 border-black bg-primary px-3 py-1 font-mono text-xs font-bold uppercase tracking-[3px]">
            WRITELY_
          </div>
          <h1 className="mb-4 text-3xl font-extrabold uppercase leading-tight max-[480px]:text-[26px]">
            Your Personal<br />Writing Studio
          </h1>
          <p className="mb-7 text-sm leading-relaxed text-gray-500">
            Craft novels, manage chapters, and track your progress — all in one brutally efficient workspace.
          </p>
          <button
            onClick={() => signIn('google')}
            className="inline-flex cursor-pointer items-center gap-1.5 border-2 border-black bg-primary px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard session={session!} />;
}
