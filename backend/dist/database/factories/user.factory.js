"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_extension_1 = require("typeorm-extension");
const user_entity_1 = require("../../user/user.entity");
exports.default = (0, typeorm_extension_1.setSeederFactory)(user_entity_1.User, (faker) => {
    const user = new user_entity_1.User();
    user.name = faker.person.fullName();
    return user;
});
//# sourceMappingURL=user.factory.js.map