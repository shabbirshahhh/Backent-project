export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }

  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  return secret;
}
