"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
(0, typeorm_1.createConnection)().then(() => {
    console.log('Connection to the database established successfully!');
}).catch(error => {
    console.error('Error establishing connection to the database:', error);
});
