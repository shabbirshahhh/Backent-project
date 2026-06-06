"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbPoolConfig = getDbPoolConfig;
function getDbPoolConfig() {
    return {
        max: Number(process.env.DB_POOL_MAX ?? 10),
        idleTimeoutMillis: Number(process.env.DB_POOL_IDLE_TIMEOUT_MS ?? 30000),
        connectionTimeoutMillis: Number(process.env.DB_POOL_CONNECTION_TIMEOUT_MS ?? 5000),
    };
}
//# sourceMappingURL=db-pool.config.js.map