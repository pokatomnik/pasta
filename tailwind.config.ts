import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,shared}/**/*.{ts,tsx}",
  ],
} satisfies Config;
