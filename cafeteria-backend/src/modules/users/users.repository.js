/**
 * Users Repository
 * Data access layer for users management
 */

const pool = require('../../config/database.config');

class UsersRepository {
  /**
   * Get all users with pagination
   * @param {number} limit - Number of records
   * @param {number} offset - Offset for pagination
   * @returns {Promise<array>} List of users
   */
  async findAll(limit, offset) {
    // Convert to integers to ensure MySQL compatibility
    const finalLimit = (limit !== undefined && limit !== null) ? Number(limit) : 50;
    const finalOffset = (offset !== undefined && offset !== null) ? Number(offset) : 0;
    
    // Validate integers
    if (!Number.isInteger(finalLimit) || !Number.isInteger(finalOffset) || finalLimit < 1 || finalOffset < 0) {
      throw new Error(`Invalid pagination parameters: limit=${limit}, offset=${offset}`);
    }
    
    // Use query without placeholders for LIMIT/OFFSET (safe because values are validated integers)
    const query = `SELECT u.id, u.nombre, u.email, u.role_id, u.active, u.mfa_enabled, u.created_at, r.nombre as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       ORDER BY u.created_at DESC
       LIMIT ${finalLimit} OFFSET ${finalOffset}`;
    
    const [rows] = await pool.query(query);
    return rows;
  }

  /**
   * Get total count of users
   * @returns {Promise<number>} Total count
   */
  async count() {
    const [rows] = await pool.execute('SELECT COUNT(*) as total FROM users');
    return rows[0].total;
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<object|null>} User object or null
   */
  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT u.id, u.nombre, u.email, u.active, u.created_at, u.updated_at, r.nombre as role_name, r.id as role_id
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<object|null>} User object or null
   */
  async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.nombre as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = ?`,
      [email]
    );
    return rows[0] || null;
  }

  /**
   * Create new user
   * @param {object} userData - User data
   * @returns {Promise<number>} Inserted user ID
   */
  async create(userData) {
    const { nombre, email, passwordHash, roleId } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (nombre, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
      [nombre, email, passwordHash, roleId]
    );
    return result.insertId;
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {object} userData - User data to update
   * @returns {Promise<boolean>} True if updated
   */
  async update(id, userData) {
    const fields = [];
    const values = [];

    if (userData.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(userData.nombre);
    }
    if (userData.email !== undefined) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    if (userData.roleId !== undefined) {
      fields.push('role_id = ?');
      values.push(userData.roleId);
    }
    if (userData.active !== undefined) {
      fields.push('active = ?');
      values.push(userData.active);
    }

    if (fields.length === 0) return false;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const [result] = await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  /**
   * Update user password
   * @param {number} id - User ID
   * @param {string} passwordHash - New password hash
   * @returns {Promise<boolean>} True if updated
   */
  async updatePassword(id, passwordHash) {
    const [result] = await pool.execute(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [passwordHash, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Soft delete user (deactivate)
   * @param {number} id - User ID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    const [result] = await pool.execute(
      'UPDATE users SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Get all roles
   * @returns {Promise<array>} List of roles
   */
  async findAllRoles() {
    const [rows] = await pool.execute('SELECT * FROM roles ORDER BY id');
    return rows;
  }
}

module.exports = new UsersRepository();
