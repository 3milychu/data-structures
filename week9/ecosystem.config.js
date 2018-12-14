module.exports = {
  apps : [{
    name: 'API',
    script: 'app.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      AWSRDS_EP: 'sensordb.chdfkvzuvifk.us-east-2.rds.amazonaws.com',
      AWSRDS_PW: 'Graduate3752',
      PHOTON_ID: '30003d000947373034353237',
      PHOTON_TOKEN: 'b947a3430f6f7fe109c7ed9765aa3e9c27fafb40'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
