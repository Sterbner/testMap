import { defineConfig } from 'vite'
// import {resolve} from "path"
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),cesium()],
  server:{
    port:2333
  }
})
