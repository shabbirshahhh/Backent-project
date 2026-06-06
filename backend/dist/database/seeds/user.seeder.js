"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const user_entity_1 = require("../../user/user.entity");
const bcrypt = __importStar(require("bcrypt"));
class UserSeeder {
    constructor() {
        this.track = true;
    }
    async run(dataSource, factoryManager) {
        const repository = dataSource.getRepository(user_entity_1.User);
        const existingAdmin = await repository.findOne({
            where: { email: 'john.doe@example.com' },
        });
        if (!existingAdmin) {
            await repository.save({
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: await bcrypt.hash('Password123!', 12),
            });
        }
        const userFactory = factoryManager.get(user_entity_1.User);
        await userFactory.saveMany(10);
    }
}
exports.default = UserSeeder;
//# sourceMappingURL=user.seeder.js.map