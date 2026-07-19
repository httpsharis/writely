"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  useGetCurrentUserQuery,
  useRefreshAccessTokenMutation,
} from "@/redux/features/auth/authApi";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setAccessToken } from "@/redux/features/auth/authSlice";

const authPages = ["/login", "/signup"]; // Add other public routes here

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state: { auth: { accessToken: string | null } }) => state.auth.accessToken,
  );

  // 1. Bootstrap: Try to get a token from the HTTP-only cookie on mount
  const [refreshTokenApi, { isLoading: isRefreshing }] =
    useRefreshAccessTokenMutation();

  useEffect(() => {
    // If we don't have a token in memory, try to get one from the cookie
    if (!accessToken) {
      refreshTokenApi()
        .unwrap()
        .then((res) => {
          dispatch(setAccessToken(res.accessToken));
        })
        .catch(() => {
          // No valid cookie exists. User is genuinely logged out. Do nothing.
        });
    }
  }, []); // Empty array ensures this only runs once on app load

  // 2. Fetch User: Automatically runs when accessToken appears in Redux
  const { data, isLoading, error } = useGetCurrentUserQuery(undefined, {
    skip: !accessToken,
  });

  // 3. Kick to login if unauthorized
  useEffect(() => {
    const isUnauthorizedError = error && "status" in error && error.status === 401;
    const isMissingToken = !accessToken && !isRefreshing;

    if ((isUnauthorizedError || isMissingToken) && !authPages.includes(pathname)) {
      router.push("/login");
    }
  }, [error, accessToken, isRefreshing, router, pathname]);

  // 4. Redirect away from login page when user is confirmed
  useEffect(() => {
    if (data?.user && authPages.includes(pathname)) {
      router.push("/");
    }
  }, [data, router, pathname]);

  // 5. Show loader while refreshing token OR fetching user data
  const showLoader = isRefreshing || (isLoading && !data);

  if (showLoader && !authPages.includes(pathname)) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
