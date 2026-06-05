  import { Seeder, Factory } from 'nestjs-seeder';
import { User } from '../../backend/src/user/user.entity';


  export class UserCreateSeeder implements Seeder{
    public async run(factory: Factory): Promise<any> {
        const users = [
            {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password',
            },
        ];
        return this.userRepository.save(users);
    }
  }