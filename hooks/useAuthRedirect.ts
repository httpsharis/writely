import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Pushes the user to `destination` once `isSuccess` flips true.
 * Used by both the login and signup flows after a mutation resolves.
 */
export function useAuthRedirect(isSuccess: boolean, destination = "/inbox") {
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) router.push(destination);
  }, [isSuccess, router, destination]);
}
