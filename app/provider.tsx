'use client';

import { SessionProvider } from "next-auth/react";
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              'flex items-center gap-3 border-2 border-black bg-white px-4 py-3 font-mono text-xs shadow-[3px_3px_0px_black] w-full max-w-sm',
            title: 'font-bold uppercase tracking-wider text-[11px]',
            description: 'text-[10px] text-gray-500 mt-0.5',
            success: 'border-green-700 bg-green-50',
            error: 'border-red-600 bg-red-50',
            info: 'border-black bg-white',
            warning: 'border-yellow-600 bg-yellow-50',
            closeButton:
              'cursor-pointer border-none bg-transparent p-0 opacity-40 hover:opacity-100',
          },
        }}
        closeButton
        duration={3000}
        gap={8}
      />
    </SessionProvider>
  );
}