/**
 * Authentication Repository
 * Data access layer for authentication
 */

const pool = require('../../config/database.config');

class AuthRepository {
  /**
   * Find user by email with role information
   * @param {string} email - User email
   * @returns {Promise<object|null>} User object or null
   */
  async findUserByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.nombre as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ? AND u.active = 1`,
      [email]
    );
    return rows[0] || null;
  }

  /**
   * Find user by ID with role information
   * @param {number} id - User ID
   * @returns {Promise<object|null>} User object or null
   */
  async findUserById(id) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.nombre as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ? AND u.active = 1`,
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Create new user
   * @param {object} userData - User data
   * @returns {Promise<number>} Inserted user ID
   */
  async createUser(userData) {
    const { nombre, email, passwordHash, roleId } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (nombre, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
      [nombre, email, passwordHash, roleId]
    );
    return result.insertId;
  }

  /**
   * Find role by name
   * @param {string} roleName - Role name
   * @returns {Promise<object|null>} Role object or null
   */
  async findRoleByName(roleName) {
    const [rows] = await pool.execute(
      'SELECT * FROM roles WHERE nombre = ?',
      [roleName]
    );
    return rows[0] || null;
  }

  /**
   * Update user's last login timestamp
   * @param {number} userId - User ID
   * @returns {Promise<void>}
   */
  async updateLastLogin(userId) {
    await pool.execute(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );
  }
}

module.exports = new AuthRepository();
