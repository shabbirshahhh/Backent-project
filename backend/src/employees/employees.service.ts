import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Employee } from './employees.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employees.dto';

@Injectable()
export class EmployeesService {

    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
        
    ){}
    async findAll(page = 1, limit = 20): Promise<{ data: Employee[]; page: number; limit: number; total: number }> {
        const safePage = Math.max(1, page);
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const [data, total] = await this.employeeRepository.findAndCount({
            skip: (safePage - 1) * safeLimit,
            take: safeLimit,
            order: { id: 'ASC' },
        });

        return {
            data,
            page: safePage,
            limit: safeLimit,
            total,
        };
    }

    async findOne(id: number): Promise<Employee> {
        const employee = await this.employeeRepository.findOne({ where: { id } });
        if (!employee) {
            throw new NotFoundException(`Employee with id ${id} not found`);
        }
        return employee;
    }

    async create(employeeData: CreateEmployeeDto): Promise<Employee> {
        const newEmployee = this.employeeRepository.create({
            name: employeeData.name.trim(),
            position: employeeData.position.trim(),
        });
        return this.employeeRepository.save(newEmployee);
    }

    async update(id: number, employeeData: UpdateEmployeeDto): Promise<Employee> {
        const employee = await this.findOne(id);
        if (employeeData.name !== undefined) {
            employee.name = employeeData.name.trim();
        }
        if (employeeData.position !== undefined) {
            employee.position = employeeData.position.trim();
        }
        return this.employeeRepository.save(employee);
    }
}
