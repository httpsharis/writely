'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          Writely
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Your personal writing studio for novels and stories
        </p>

        {/* Auth Status */}
        <div className="mb-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
          {status === 'loading' && (
            <p>Loading...</p>
          )}

          {status === 'unauthenticated' && (
            <button
              onClick={() => signIn('google')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign in with Google
            </button>
          )}

          {status === 'authenticated' && session?.user && (
            <div className="space-y-4">
              <p className="text-green-600 font-medium">
                ✓ Logged in as: {session.user.email}
              </p>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}