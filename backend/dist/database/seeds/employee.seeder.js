"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const employees_entity_1 = require("../../employees/employees.entity");
class EmployeeSeeder {
    constructor() {
        this.track = true;
    }
    async run(dataSource, factoryManager) {
        const repository = dataSource.getRepository(employees_entity_1.Employee);
        const existingLead = await repository.findOne({
            where: { name: 'Jane Doe' },
        });
        if (!existingLead) {
            await repository.save({
                name: 'Jane Doe',
                position: 'Engineering Lead',
            });
        }
        const employeeFactory = factoryManager.get(employees_entity_1.Employee);
        await employeeFactory.saveMany(15);
    }
}
exports.default = EmployeeSeeder;
//# sourceMappingURL=employee.seeder.js.map