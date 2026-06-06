import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employees.entity';  
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [TypeOrmModule.forFeature([Employee]), AuthModule],
  
  providers: [EmployeesService],
  controllers: [EmployeesController]
})
export class EmployeesModule {}
