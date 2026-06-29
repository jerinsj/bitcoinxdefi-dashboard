type SupabaseServerConfig = {
  url: string;
  serviceRoleKey: string;
};

export function getSupabaseServerConfig(): SupabaseServerConfig | null {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

export function hasSupabaseServerConfig() {
  return getSupabaseServerConfig() !== null;
}

export async function supabaseServerRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const config = getSupabaseServerConfig();

  if (!config) {
    throw new Error("Missing Supabase server environment variables");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      authorization: `Bearer ${config.serviceRoleKey}`,
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Supabase request failed: ${response.status} ${responseText}`
    );
  }

  if (!responseText) {
    return null as T;
  }

  return JSON.parse(responseText) as T;
}
