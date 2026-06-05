import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../user/user.entity';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.name = faker.person.fullName();
  return user;
});
