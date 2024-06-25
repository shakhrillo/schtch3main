module.exports = {
  apps : [{
    name: 'sch-bg',
    cmd: 'uvicorn app.main:app --host 0.0.0.0 --port 8200',
    interpreter: 'python',
    interpreter_args: '-m',
    args: 'uvicorn app.main:app --host 0.0.0.0 --port 8200',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
