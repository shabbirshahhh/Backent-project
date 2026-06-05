import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
export default class EmployeeSeeder implements Seeder {
    track: boolean;
    run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void>;
}
//# sourceMappingURL=employee.seeder.d.ts.map