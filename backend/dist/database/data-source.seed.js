"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDataSourceOptions = void 0;
require("dotenv/config");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const employees_entity_1 = require("../employees/employees.entity");
const isProduction = process.env.NODE_ENV === 'production';
const rootDir = isProduction ? 'dist' : 'src';
const fileExt = isProduction ? 'js' : 'ts';
exports.seedDataSourceOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL ?? '',
    entities: [user_entity_1.User, employees_entity_1.Employee],
    synchronize: false,
    seeds: [`${rootDir}/database/seeds/**/*.seeder.${fileExt}`],
    factories: [`${rootDir}/database/factories/**/*.factory.${fileExt}`],
};
const seedDataSource = new typeorm_1.DataSource(exports.seedDataSourceOptions);
exports.default = seedDataSource;
//# sourceMappingURL=data-source.seed.js.map