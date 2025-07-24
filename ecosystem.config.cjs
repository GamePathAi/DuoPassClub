module.exports = {
  apps: [{
    name: 'duopass-app',
    script: 'npm',
    args: 'run preview -- --host 0.0.0.0 --port 3000',
    cwd: '/var/www/duopass/app',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/duopass/error.log',
    out_file: '/var/log/duopass/out.log',
    log_file: '/var/log/duopass/combined.log',
    time: true
  }]
};