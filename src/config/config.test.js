'use strict';
import {
    join
} from 'path';

let config = {
    env: 'development',
    port: 9106,
    mysql: {
        host: '',
        poolSize: 5,
        user: '',
        password: '',
        database: '',
        logging: console.log
    },
    logDir: join(__dirname, '../../logs'),
    uploadDir: join(__dirname, '../../files/tmp'),
    fileDir: join(__dirname, '../../files'),
    maxUploadFileSize: filesizeParser("100M"),
    apiTimeout: 5000,
    poolSize: 5,
    appTimeout: 300000
}


export default config;