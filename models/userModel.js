const pool = require("../db");

const UserModel = {
  findByUsername: async (username) => {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },

  create: async (
    username,
    password,
    email,
    phone,
    role = "user",
    status = "pending",
  ) => {
    const result = await pool.query(
      `
      INSERT INTO users (username, password, email, phone, role, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [username, password, email, phone, role, status],
    );

    return result.rows[0];
  },

  getAll: async () => {
    const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
    return result.rows;
  },

  approve: async (id, role) => {
    await pool.query(
      `
      UPDATE users
      SET status = 'active',
          role = $1
      WHERE id = $2
      `,
      [role, id],
    );
  },

  delete: async (id) => {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  },
};

module.exports = UserModel;
