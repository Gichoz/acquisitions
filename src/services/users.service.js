import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

// Helper to create errors with specific HTTP status codes
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.createdAt,
        updated_at: users.updatedAt,
      })
      .from(users);
  } catch (e) {
    logger.error('Error fetching all users:', e);
    throw e;
  }
};

export const getUserById = async id => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.createdAt,
        updated_at: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw createError('User not found', 404);
    }

    return user;
  } catch (e) {
    logger.error(`Error getting user by id ${id}:`, e);
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    // Check existence first
    const existingUser = await getUserById(id);

    // Ensure email uniqueness if updating email
    if (updates.email && updates.email !== existingUser.email) {
      const [emailExists] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, updates.email))
        .limit(1);
      if (emailExists) {
        throw createError('Email is already taken', 409);
      }
    }

    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.createdAt,
        updated_at: users.updatedAt,
      });

    if (!updatedUser) {
      throw createError('User not found', 404);
    }

    logger.info(`User ${updatedUser.email} updated successfully`);
    return updatedUser;
  } catch (e) {
    logger.error(`Error updating user ${id}:`, e);
    throw e;
  }
};

export const deleteUser = async id => {
  try {
    // Check existence before deleting
    await getUserById(id);

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    if (!deletedUser) {
      throw createError('User not found', 404);
    }

    logger.info(`User ${deletedUser.email} deleted successfully`);
    return deletedUser;
  } catch (e) {
    logger.error(`Error deleting user ${id}:`, e);
    throw e;
  }
};