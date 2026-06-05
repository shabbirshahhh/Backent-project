import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Employee } from '../../employees/employees.entity';

export default class EmployeeSeeder implements Seeder {
  track = true;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repository = dataSource.getRepository(Employee);

    const existingLead = await repository.findOne({
      where: { name: 'Jane Doe' },
    });

    if (!existingLead) {
      await repository.save({
        name: 'Jane Doe',
        position: 'Engineering Lead',
      });
    }

    const employeeFactory = factoryManager.get(Employee);
    await employeeFactory.saveMany(15);
  }
}
