import Constants from 'expo-constants';

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

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  if (env === 'production') {
    return ENV.prod;
  } else {
    return ENV.dev;
  }
};

export default getEnvVars;
