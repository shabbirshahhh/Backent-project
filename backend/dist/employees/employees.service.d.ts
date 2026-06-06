import { Repository } from 'typeorm';
import { Employee } from './employees.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employees.dto';
export declare class EmployeesService {
    private employeeRepository;
    constructor(employeeRepository: Repository<Employee>);
    findAll(page?: number, limit?: number): Promise<{
        data: Employee[];
        page: number;
        limit: number;
        total: number;
    }>;
    findOne(id: number): Promise<Employee>;
    create(employeeData: CreateEmployeeDto): Promise<Employee>;
    update(id: number, employeeData: UpdateEmployeeDto): Promise<Employee>;
}
//# sourceMappingURL=employees.service.d.ts.map