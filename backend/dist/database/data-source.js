"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
require("dotenv/config");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const employees_entity_1 = require("../employees/employees.entity");
const db_pool_config_1 = require("./db-pool.config");
const isProduction = process.env.NODE_ENV === 'production';
const rootDir = isProduction ? 'dist' : 'src';
const fileExt = isProduction ? 'js' : 'ts';
exports.dataSourceOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL ?? '',
    entities: [user_entity_1.User, employees_entity_1.Employee],
    synchronize: false,
    migrations: [`${rootDir}/database/migrations/*.${fileExt}`],
    migrationsTableName: 'migrations',
    extra: (0, db_pool_config_1.getDbPoolConfig)(),
};
const dataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
exports.default = dataSource;
//# sourceMappingURL=data-source.js.map