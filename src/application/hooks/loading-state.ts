import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function useLoadingState(): boolean {
  const router = useRouter();
  const { status } = useSession();
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    const on = () => setIsPageLoading(true);
    const off = () => setIsPageLoading(false);

    router.events.on('routeChangeStart', on);
    router.events.on('routeChangeComplete', off);
    router.events.on('routeChangeError', off);

    return () => {
      router.events.off('routeChangeStart', on);
      router.events.off('routeChangeComplete', off);
      router.events.off('routeChangeError', off);
    };
  }, [router]);

  return isPageLoading || status == 'loading';
}
