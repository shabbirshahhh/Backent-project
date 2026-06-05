import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Employee } from './employees.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmployeesService {

    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
        
    ){}
    async findAll(): Promise<Employee[]> {
        return this.employeeRepository.find();
    }

    async findOne(id: number): Promise<Employee> {
        const employee = await this.employeeRepository.findOne({ where: { id } });
        if (!employee) {
            throw new NotFoundException(`Employee with id ${id} not found`);
        }
        return employee;
    }

    async create(employeeData: Partial<Employee>): Promise<Employee> {
        const newEmployee = this.employeeRepository.create(employeeData);
        return this.employeeRepository.save(newEmployee);
    }

    async update(id: number, employeeData: Partial<Employee>): Promise<Employee> {
        const employee = await this.findOne(id);
        Object.assign(employee, employeeData);
        return this.employeeRepository.save(employee);
    }
}
