import { createConnection } from 'typeorm';

createConnection().then(() => {
    console.log('Connection to the database established successfully!');
}).catch(error => {
    console.error('Error establishing connection to the database:', error);
});