"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const employees_controller_1 = require("./employees.controller");
describe('EmployeesController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [employees_controller_1.EmployeesController],
        }).compile();
        controller = module.get(employees_controller_1.EmployeesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=employees.controller.spec.js.map