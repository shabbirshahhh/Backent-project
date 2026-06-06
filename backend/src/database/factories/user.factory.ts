import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../user/user.entity';
import * as bcrypt from 'bcrypt';

export default setSeederFactory(User, async (faker) => {
  const user = new User();
  user.name = faker.person.fullName();
  user.email = faker.internet.email().toLowerCase();
  user.password = await bcrypt.hash('Password123!', 12);
  return user;
});
