"use client";

import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";

interface GoogleLoginButtonProps {
  onSuccess: (response: CredentialResponse) => void;
  isLoading: boolean;
}

export function GoogleLoginButton({ onSuccess, isLoading }: GoogleLoginButtonProps) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      {/* Wrap in div to block clicks when loading */}
      <div className="w-full flex flex-col items-center justify-center min-h-12.5 relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm rounded-md" />
        )}
        <GoogleLogin
          onSuccess={onSuccess}
          onError={() => console.error("Google Login Failed")}
          theme="filled_blue"
          size="large"
          shape="rectangular"
          width="300"
          text="continue_with"
          ux_mode="redirect"
        />
      </div>
    </GoogleOAuthProvider>
  );
}