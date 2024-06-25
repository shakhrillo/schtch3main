module.exports = {
  apps : [{
    name: 'sql-server-dtc',
    cmd: 'app.py',
    args: 'arg1 arg2',
    autorestart: false,
    watch: true,
    instances: 4,
    max_memory_restart: '1G',
    env: {
      ENV: 'development'
    },
    env_production : {
      ENV: 'production'
    }
  }, {
    name: 'sql-server-dtc-3',
    cmd: 'app.py',
    interpreter: 'python3'
  }]
};
