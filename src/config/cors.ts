import { CorsOptions } from "cors";

const allowedOrigins: string[] = [
  "http://localhost:5173",
  "https://localhost:5173",
];

export const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const isLocalhost = origin.includes("localhost") || origin.includes("127.0.0.1");
    const isPrivateIP = origin.match(/^https?:\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/);
    const isRenderDomain = origin.endsWith(".onrender.com");

    if (isLocalhost || isPrivateIP || isRenderDomain || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};
