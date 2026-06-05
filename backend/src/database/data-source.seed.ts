import 'dotenv/config';
import { DataSource, type DataSourceOptions } from 'typeorm';
import type { SeederOptions } from 'typeorm-extension';
import { User } from '../user/user.entity';
import { Employee } from '../employees/employees.entity';

const isProduction = process.env.NODE_ENV === 'production';
const rootDir = isProduction ? 'dist' : 'src';
const fileExt = isProduction ? 'js' : 'ts';

export const seedDataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL ?? '',
  entities: [User, Employee],
  synchronize: false,
  seeds: [`${rootDir}/database/seeds/**/*.seeder.${fileExt}`],
  factories: [`${rootDir}/database/factories/**/*.factory.${fileExt}`],
};

const seedDataSource = new DataSource(seedDataSourceOptions);

export default seedDataSource;
