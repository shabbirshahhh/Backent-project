import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../user/user.entity';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
  track = true;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repository = dataSource.getRepository(User);

    const existingAdmin = await repository.findOne({
      where: { email: 'john.doe@example.com' },
    });

    if (!existingAdmin) {
      await repository.save({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('Password123!', 12),
      });
    }

    const userFactory = factoryManager.get(User);
    await userFactory.saveMany(10);
  }
}
