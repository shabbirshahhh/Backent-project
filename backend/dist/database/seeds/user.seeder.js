"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_entity_1 = require("../../user/user.entity");
class UserSeeder {
    constructor() {
        this.track = true;
    }
    async run(dataSource, factoryManager) {
        const repository = dataSource.getRepository(user_entity_1.User);
        const existingAdmin = await repository.findOne({
            where: { name: 'John Doe' },
        });
        if (!existingAdmin) {
            await repository.save({ name: 'John Doe' });
        }
        const userFactory = factoryManager.get(user_entity_1.User);
        await userFactory.saveMany(10);
    }
}
exports.default = UserSeeder;
//# sourceMappingURL=user.seeder.js.map