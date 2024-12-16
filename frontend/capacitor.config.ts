import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'frontend',
  webDir: 'www',
  server: {
    allowNavigation: ['*']
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
