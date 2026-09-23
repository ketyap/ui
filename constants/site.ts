export const FALLBACK_SITE_ORIGIN = "https://ui.ketyap.me" as const;

const getBaseUrl = () => {
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return process.env.SITE_URL ?? FALLBACK_SITE_ORIGIN;
};

const baseUrl = getBaseUrl();

export const SITE = {
  AUTHOR: {
    NAME: "Ketyap",
  },
  DESCRIPTION: {
    LONG: "Accessible React components with fluid interactions, built on Base UI.",
    SHORT: "React components with fluid interactions",
  },
  KEYWORDS: [
    "shadcn",
    "shadcn registry",
    "component registry",
    "shadcn components",
    "next.js",
    "tailwindcss",
    "npx shadcn add",
  ] as const,
  NAME: "Ketyap UI",
  OG_IMAGE: `${baseUrl}/og`,
  REGISTRY: baseUrl,
  URL: baseUrl,
};

export const META_THEME_COLORS = {
  dark: "#09090b",
  light: "#ffffff",
};

export const UTM_PARAMS = {
  utm_source: new URL(baseUrl).hostname,
};
