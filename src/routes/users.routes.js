import { Router } from 'express';
import {
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from '#controllers/users.controller.js';
import { authenticateToken, requireRole } from '#middleware/auth.middleware.js';

const router = Router();

// Protect all user endpoints with authentication
router.use(authenticateToken);

// Admin-only: List all users
router.get('/', requireRole(['admin']), fetchAllUsers);

// Authenticated users: Get user details by ID
router.get('/:id', fetchUserById);

// Authenticated users: Update profile (self or admin)
router.put('/:id', updateUserById);

// Admin-only: Delete user by ID
router.delete('/:id', requireRole(['admin']), deleteUserById);

export default router;
