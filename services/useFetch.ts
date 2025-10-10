import { useState, useEffect, useCallback } from 'react';

const useFetch = <T>( fetchFunction: () => Promise<T>, autoFetch = true ) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);


  const fetchData = useCallback( async () => {
    
    try {
      setLoading(false);
      setError(null);

      const result = await fetchFunction();

      setData(result);

    } catch (err) {
      // @ts-ignore
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }, [fetchFunction] );

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  }

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return { data, loading, error, refetch: fetchData, reset };
}

export default useFetch;