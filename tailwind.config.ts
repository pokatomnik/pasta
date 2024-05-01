import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,shared,entities}/**/*.{ts,tsx}",
  ],
} satisfies Config;
