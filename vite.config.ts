import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx"
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig((env)=>{
  const viteEnv = loadEnv(env.mode, process.cwd());
  

  return {
    root: process.cwd(),
    base: '/',
    publicDir: './public',
    resolve: { 
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@public': path.resolve(__dirname, 'public'),
      },
    },
    define: {
      
    },
    server: {
      port: 3000,
      https: false,
      cors: true,
      proxy: {
        '/api': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/local': {
          target: 'http://localhost:3002',
          changeOrigin: true,
        },
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      // 模板自动导入组件
      AutoImport({
        resolvers: [NaiveUiResolver()],
      }),
      Components({
        resolvers: [
          NaiveUiResolver()
        ]
      }),
    ],
    build: {
      target: ['model', ''], // 默认  
      assetsDir: 'assets',
      assetsInlineLimit: 4096, // 4k用base64
      cssCodeSplit: true, // css 
      reportCompressedSize: true, // 异步 chunk 拆分
      sourcemap: false,
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    }
  }
})
