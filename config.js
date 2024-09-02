import Constants from 'expo-constants';

// Default environment settings
const ENV = {
  dev: {
    ENVIRONMENT: 'development',
    // other dev-specific configs
  },
  prod: {
    ENVIRONMENT: 'production',
    // other prod-specific configs
  }
};

// Fetch the environment variable manually or fallback to release channel
const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  // Manually set environment based on an environment variable or fallback to the release channel
  const envVariable = Constants.manifest.extra?.env || env;

  if (envVariable === 'production') {
    return ENV.prod;
  } else {
    return ENV.dev;
  }
};

export default getEnvVars;
