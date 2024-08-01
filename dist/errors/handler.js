"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, request, response, next) => {
    console.error(error);
    return response.status(500).json({ error: error.message });
};
exports.default = errorHandler;
