import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    return {
        plugins: [react(),tailwindcss()],
        server: {
            host:true,
            allowedHosts: ['.ap-south-1.elb.amazonaws.com'],
            port: 5173,
            proxy: {
                "/api": {
                    target: "http://backend-service:8080",
                    changeOrigin: true,
                },
            },
        },
    };
});