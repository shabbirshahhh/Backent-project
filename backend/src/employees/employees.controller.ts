import { Controller, Get, Post, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './employees.entity';

@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    @Get()
    async findAll(): Promise<Employee[]> {
        return this.employeesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Employee> {
        return this.employeesService.findOne(id);
    }

    @Post()
    async createEmployee(@Body() body: Partial<Employee>): Promise<Employee> {
        return this.employeesService.create(body);
    }

    @Put(':id')
    async updateEmployee(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<Employee>,
    ): Promise<Employee> {
        return this.employeesService.update(id, body);
    }
}
