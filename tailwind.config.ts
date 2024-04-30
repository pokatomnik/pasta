import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components,shared}/**/*.{ts,tsx}",
  ],
} satisfies Config;
