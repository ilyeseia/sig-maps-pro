import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import type { User, UserRole } from '@/lib/types';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(data: {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
}): Promise<User> {
  const hashedPassword = await hashPassword(data.password);
  
  const user = await db.user.create({
    data: {
      email: data.email,
      username: data.username,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      organization: data.organization,
      role: 'USER',
    },
  });
  
  // Create activity record
  await db.activity.create({
    data: {
      action: 'REGISTER',
      details: `New user registered: ${data.username}`,
      userId: user.id,
    },
  });
  
  return user;
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await db.user.findUnique({
    where: { email },
  });
  
  if (!user || !user.isActive) {
    return null;
  }
  
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }
  
  // Create activity record
  await db.activity.create({
    data: {
      action: 'LOGIN',
      details: `User logged in: ${user.username}`,
      userId: user.id,
    },
  });
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await db.user.findUnique({
    where: { id },
  });
  
  if (!user) return null;
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await db.user.findUnique({
    where: { email },
  });
  
  if (!user) return null;
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
}

export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    USER: 1,
    ADMIN: 2,
    SUPER_ADMIN: 3,
  };
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
