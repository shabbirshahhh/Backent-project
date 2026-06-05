import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
export default class UserSeeder implements Seeder {
    track: boolean;
    run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void>;
}
//# sourceMappingURL=user.seeder.d.ts.map