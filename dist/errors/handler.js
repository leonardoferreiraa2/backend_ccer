"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, request, response, next) => {
    console.error(error);
    return response.status(500).json({ message: 'Internal server error' });
};
exports.default = errorHandler;
