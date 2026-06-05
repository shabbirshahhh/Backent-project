import { Repository } from 'typeorm';
import { Employee } from './employees.entity';
export declare class EmployeesService {
    private employeeRepository;
    constructor(employeeRepository: Repository<Employee>);
    findAll(): Promise<Employee[]>;
    findOne(id: number): Promise<Employee>;
    create(employeeData: Partial<Employee>): Promise<Employee>;
    update(id: number, employeeData: Partial<Employee>): Promise<Employee>;
}
//# sourceMappingURL=employees.service.d.ts.map