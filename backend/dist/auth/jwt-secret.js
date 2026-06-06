"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecret = getJwtSecret;
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is required');
    }
    if (secret.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters long');
    }
    return secret;
}
//# sourceMappingURL=jwt-secret.js.map