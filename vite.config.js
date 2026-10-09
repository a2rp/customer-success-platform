import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/customer-success-platform/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
