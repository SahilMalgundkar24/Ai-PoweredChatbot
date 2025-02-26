// app.config.js
export default ({ config }) => ({
  ...config,
  extra: {
    eas: {
      projectId: "921d14e7-98e6-4c79-88e3-ee3bb69f3f8c",
    },
    EXPO_PUBLIC_GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
  },
});
