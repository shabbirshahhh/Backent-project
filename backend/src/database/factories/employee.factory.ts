import { setSeederFactory } from 'typeorm-extension';
import { Employee } from '../../employees/employees.entity';

export default setSeederFactory(Employee, (faker) => {
  const employee = new Employee();
  employee.name = faker.person.fullName();
  employee.position = faker.person.jobTitle();
  return employee;
});
