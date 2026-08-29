import logger from "#config/logger.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "#services/users.service.js";
import {
  userIdSchema,
  updateUserSchema,
} from "#validations/users.validation.js";
import { formatValidationError } from "#utils/format.js";

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info("Fetching all users");

    const allUsers = await getAllUsers();

    res.status(200).json({
      message: "Successfully retrieved users",
      data: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error("Error fetching all users:", e);
    next(e);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    logger.info(`Fetching user by id: ${req.params.id}`);

    const validationResult = userIdSchema.safeParse({ id: req.params.id });

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    const user = await getUserById(id);

    logger.info(`User ${user.email} retrieved successfully`);
    res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (e) {
    logger.error(`Error fetching user by id ${req.params.id}:`, e);
    next(e);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    logger.info(`Updating user: ${req.params.id}`);

    const idValidation = userIdSchema.safeParse({ id: req.params.id });

    if (!idValidation.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValidationError(idValidation.error),
      });
    }

    const updateValidation = updateUserSchema.safeParse(req.body);

    if (!updateValidation.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValidationError(updateValidation.error),
      });
    }

    const { id } = idValidation.data;
    const updates = { ...updateValidation.data };

    // Only allow users to update their own profile, or admins to update anyone
    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({
        error: "Access denied",
        message: "You can only update your own information",
      });
    }

    // Prevent non-admins from escalating permissions via role changes
    if (updates.role && req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access denied",
        message: "Only administrators can change user roles",
      });
    }

    if (req.user.role !== "admin") {
      delete updates.role;
    }

    const updatedUser = await updateUser(id, updates);

    logger.info(`User ${updatedUser.email} updated successfully`);
    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (e) {
    logger.error(`Error updating user ${req.params.id}:`, e);
    next(e);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    logger.info(`Deleting user: ${req.params.id}`);

    const validationResult = userIdSchema.safeParse({ id: req.params.id });

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;

    // Prevent administrators from deleting their own account
    if (req.user.id === id) {
      return res.status(403).json({
        error: "Operation denied",
        message: "You cannot delete your own account",
      });
    }

    const deletedUser = await deleteUser(id);

    logger.info(`User ${deletedUser.email} deleted successfully`);
    res.status(200).json({
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (e) {
    logger.error(`Error deleting user ${req.params.id}:`, e);
    next(e);
  }
};
