import 'dotenv/config';
import { DataSource, type DataSourceOptions } from 'typeorm';
import type { SeederOptions } from 'typeorm-extension';
export declare const dataSourceOptions: DataSourceOptions & SeederOptions;
declare const dataSource: DataSource;
export default dataSource;
//# sourceMappingURL=data-source.d.ts.map