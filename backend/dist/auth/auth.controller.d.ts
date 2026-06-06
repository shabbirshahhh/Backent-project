import { AuthService } from './auth.service';
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RefreshDto {
    refreshToken: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>;
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>;
    logout(dto: RefreshDto): Promise<{
        success: boolean;
    }>;
    getCurrentUser(user: any): {
        id: any;
        email: any;
        name: any;
    };
}
//# sourceMappingURL=auth.controller.d.ts.map