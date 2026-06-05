# Secure JWT Authentication Implementation

This backend project includes a production-ready JWT authentication system with security best practices.

## Features

✅ **Secure Password Hashing**
- Uses bcrypt with 12 salt rounds (industry standard)
- Passwords are never stored in plain text

✅ **JWT Token Management**
- Access tokens expire after 24 hours
- Refresh tokens expire after 7 days
- HS256 algorithm for token signing
- Tokens include user ID and email in payload

✅ **Password Strength Validation**
- Minimum 8 characters
- Must include uppercase letters
- Must include lowercase letters
- Must include numbers
- Must include special characters

✅ **Protected Routes**
- JWT guard protects sensitive endpoints
- Automatic token validation on protected routes
- Current user decorator for easy access to auth context

✅ **Security Best Practices**
- Unique email constraint in database
- Conflict detection for duplicate registrations
- Proper error messages (doesn't reveal if email exists)
- Token signing with HS256 algorithm
- Secure password comparison with bcrypt

## Environment Variables

Required `.env` file configuration:

```
DATABASE_URL=your-postgres-connection-string
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=7d
NODE_ENV=development
PORT=3000
```

⚠️ **IMPORTANT**: Change `JWT_SECRET` to a strong random string in production. Minimum 32 characters recommended.

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## API Endpoints

### Authentication Routes

#### Register New User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

Response (201):
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User (Protected)
```
GET /auth/me
Authorization: Bearer {accessToken}

Response (200):
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe"
}
```

## Using Authentication in Your Routes

### Protect a Route

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CurrentUser } from './auth/current-user.decorator';

@Controller('protected')
export class ProtectedController {
  @UseGuards(JwtAuthGuard)
  @Get('resource')
  getResource(@CurrentUser() user: any) {
    // user is automatically available from the JWT token
    return {
      message: `Hello ${user.name}, this is a protected resource`,
      userId: user.id,
    };
  }
}
```

### Include Token in Requests

```bash
# Using curl
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" http://localhost:3000/protected/resource

# Using fetch in JavaScript
fetch('http://localhost:3000/protected/resource', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
```

## Security Features Implemented

1. **Bcrypt Password Hashing**
   - Algorithms: bcrypt with 12 rounds
   - Protects against rainbow table attacks
   - Automatically handles salt generation

2. **JWT Best Practices**
   - Bearer token in Authorization header
   - Short-lived access tokens (24h)
   - Longer-lived refresh tokens (7d)
   - HS256 symmetric signing

3. **Validation**
   - Strong password requirements enforced
   - Email uniqueness constraint
   - Input validation on all auth endpoints

4. **Error Handling**
   - Generic error messages don't reveal user existence
   - Proper HTTP status codes
   - Type-safe error responses

## Production Considerations

⚠️ **Before deploying to production:**

1. ✅ Generate a strong JWT_SECRET (minimum 32 characters)
2. ✅ Use HTTPS only (enforce in middleware)
3. ✅ Add rate limiting to auth endpoints
4. ✅ Implement token refresh endpoint
5. ✅ Add logout functionality with token blacklist
6. ✅ Monitor for brute force attacks
7. ✅ Use secure cookies for token storage (if applicable)
8. ✅ Implement CORS with appropriate origins
9. ✅ Add audit logging for auth events
10. ✅ Consider adding 2FA for enhanced security

## Testing Authentication

```bash
# Start the server
npm run start:dev

# Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# Use the access token
TOKEN="your_access_token_here"
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/auth/me
```

## File Structure

```
src/
├── auth/
│   ├── auth.controller.ts      # API endpoints
│   ├── auth.service.ts         # Business logic
│   ├── auth.module.ts          # Module configuration
│   ├── jwt.strategy.ts         # Passport JWT strategy
│   ├── jwt-auth.guard.ts       # Route protection guard
│   └── current-user.decorator.ts # User extraction decorator
├── user/
│   ├── user.entity.ts          # User database model
│   └── user.module.ts
└── app.module.ts               # Main app module
```

## Database Schema

The User entity includes:
- `id`: Primary key (auto-increment)
- `email`: Unique email address
- `password`: Bcrypt hashed password
- `name`: User's name
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

## Dependencies

```json
{
  "dependencies": {
    "@nestjs/jwt": "^11.x.x",
    "@nestjs/passport": "^10.x.x",
    "passport": "^0.7.x",
    "passport-jwt": "^4.x.x",
    "bcrypt": "^5.x.x"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.x.x",
    "@types/passport-jwt": "^3.x.x"
  }
}
```

## Error Codes

| Status | Error | Meaning |
|--------|-------|---------|
| 400 | BadRequestException | Missing required fields |
| 409 | ConflictException | User email already exists |
| 401 | UnauthorizedException | Invalid credentials or token |
| 401 | UnauthorizedException | Weak password |
| 401 | Unauthorized | Token expired or invalid |

---

**Remember**: Security is a continuous process. Regularly update dependencies and review security practices.
