"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const employees_service_1 = require("./employees.service");
describe('EmployeesService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [employees_service_1.EmployeesService],
        }).compile();
        service = module.get(employees_service_1.EmployeesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=employees.service.spec.js.map