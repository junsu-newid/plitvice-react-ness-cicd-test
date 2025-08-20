// eslint-disable-next-line
module.exports = {
    apps: [
        {
            name: 'paro',
            cwd: './web/paro',
            script: './node_modules/.bin/react-router-serve',
            args: './build/server/index.js',
            exec_mode: 'fork',
            instances: 1,
            env_stage: {
                PORT: 8001,
                NODE_ENV: 'staging',
            },
            env_production: {
                PORT: 3001,
                NODE_ENV: 'production',
            },
        },
        {
            name: 'admin',
            cwd: './web/ness',
            script: './node_modules/.bin/react-router-serve',
            args: './build/server/index.js',
            exec_mode: 'fork',
            instances: 1,
            env_stage: {
                PORT: 8002,
                NODE_ENV: 'staging',
            },
            env_production: {
                PORT: 3002,
                NODE_ENV: 'production',
            },
        },
    ],
};
