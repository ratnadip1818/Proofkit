const VERCEL_TOKEN = process.env.VERCEL_AUTH_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional

/**
 * Registers a custom domain to the Vercel project configuration.
 */
export async function addDomainToVercel(domain: string): Promise<void> {
  if (!VERCEL_TOKEN || !PROJECT_ID) {
    console.warn("Vercel API credentials not configured. Skipping domain addition.");
    return;
  }

  const queryParams = TEAM_ID ? `?teamId=${TEAM_ID}` : "";
  const url = `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains${queryParams}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: domain }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.error?.message || `Vercel API error ${res.status}`;
    throw new Error(`Failed to add domain to Vercel: ${message}`);
  }
}

/**
 * Removes a custom domain from the Vercel project configuration.
 */
export async function removeDomainFromVercel(domain: string): Promise<void> {
  if (!VERCEL_TOKEN || !PROJECT_ID) {
    console.warn("Vercel API credentials not configured. Skipping domain removal.");
    return;
  }

  const queryParams = TEAM_ID ? `?teamId=${TEAM_ID}` : "";
  const url = `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${domain}${queryParams}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    // 404 is fine (means domain was already removed or didn't exist in Vercel)
    if (res.status !== 404) {
      const message = errorData.error?.message || `Vercel API error ${res.status}`;
      throw new Error(`Failed to remove domain from Vercel: ${message}`);
    }
  }
}
