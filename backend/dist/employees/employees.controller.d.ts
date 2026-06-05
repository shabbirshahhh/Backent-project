import { EmployeesService } from './employees.service';
import { Employee } from './employees.entity';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    findAll(): Promise<Employee[]>;
    findOne(id: number): Promise<Employee>;
    createEmployee(body: Partial<Employee>): Promise<Employee>;
    updateEmployee(id: number, body: Partial<Employee>): Promise<Employee>;
}
//# sourceMappingURL=employees.controller.d.ts.map