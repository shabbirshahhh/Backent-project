import 'dotenv/config';
import { DataSource, type DataSourceOptions } from 'typeorm';
import type { SeederOptions } from 'typeorm-extension';
import { User } from '../user/user.entity';
import { Employee } from '../employees/employees.entity';

const isProduction = process.env.NODE_ENV === 'production';
const rootDir = isProduction ? 'dist' : 'src';
const fileExt = isProduction ? 'js' : 'ts';

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL ?? '',
  entities: [User, Employee],
  synchronize: false,
  migrations: [`${rootDir}/database/migrations/*.${fileExt}`],
  migrationsTableName: 'migrations',
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
