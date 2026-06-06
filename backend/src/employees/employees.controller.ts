import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './employees.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEmployeeDto, ListEmployeesQueryDto, UpdateEmployeeDto } from './employees.dto';

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    @Get()
    async findAll(@Query() query: ListEmployeesQueryDto) {
        return this.employeesService.findAll(query.page, query.limit);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Employee> {
        return this.employeesService.findOne(id);
    }

    @Post()
    async createEmployee(@Body() body: CreateEmployeeDto): Promise<Employee> {
        return this.employeesService.create(body);
    }

    @Put(':id')
    async updateEmployee(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateEmployeeDto,
    ): Promise<Employee> {
        return this.employeesService.update(id, body);
    }
}
