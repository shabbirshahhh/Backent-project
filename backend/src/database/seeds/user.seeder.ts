import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../user/user.entity';

export default class UserSeeder implements Seeder {
  track = true;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repository = dataSource.getRepository(User);

    const existingAdmin = await repository.findOne({
      where: { name: 'John Doe' },
    });

    if (!existingAdmin) {
      await repository.save({ name: 'John Doe' });
    }

    const userFactory = factoryManager.get(User);
    await userFactory.saveMany(10);
  }
}
