"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_extension_1 = require("typeorm-extension");
const employees_entity_1 = require("../../employees/employees.entity");
exports.default = (0, typeorm_extension_1.setSeederFactory)(employees_entity_1.Employee, (faker) => {
    const employee = new employees_entity_1.Employee();
    employee.name = faker.person.fullName();
    employee.position = faker.person.jobTitle();
    return employee;
});
//# sourceMappingURL=employee.factory.js.map