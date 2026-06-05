import { Module } from '@nestjs/common';
import { Employee } from '../employees/employees.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({

imports :[TypeOrmModule.forFeature([Employee])],

})
export class UserModule {}
