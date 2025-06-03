
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.92dd0ad09a4c4ac4b2bd25a04cfba442',
  appName: 'BiriyaniExpress',
  webDir: 'dist',
  server: {
    url: 'https://92dd0ad0-9a4c-4ac4-b2bd-25a04cfba442.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
