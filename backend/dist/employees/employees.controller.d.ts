import { EmployeesService } from './employees.service';
import { Employee } from './employees.entity';
import { CreateEmployeeDto, ListEmployeesQueryDto, UpdateEmployeeDto } from './employees.dto';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    findAll(query: ListEmployeesQueryDto): Promise<{
        data: Employee[];
        page: number;
        limit: number;
        total: number;
    }>;
    findOne(id: number): Promise<Employee>;
    createEmployee(body: CreateEmployeeDto): Promise<Employee>;
    updateEmployee(id: number, body: UpdateEmployeeDto): Promise<Employee>;
}
//# sourceMappingURL=employees.controller.d.ts.map