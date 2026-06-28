"use client";

import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json());

export function useProtocol(api: string) {
  const { data, error, isLoading } = useSWR(api, fetcher, {
    refreshInterval: 300000,
  });

  return {
    data,
    error,
    isLoading,
  };
}
