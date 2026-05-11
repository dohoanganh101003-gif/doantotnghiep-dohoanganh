const pool = require("../../db");

module.exports = {
  getStats: async (user) => {
    let query = `
      SELECT 
        COUNT(*) as total,
        SUM(cong_suat) as total_power,
        COUNT(*) FILTER (WHERE trang_thai = 'Hoạt động') as hoat_dong,
        COUNT(*) FILTER (WHERE trang_thai = 'Bảo trì') as bao_tri,
        COUNT(*) FILTER (WHERE trang_thai = 'Ngừng') as ngung
      FROM nhamay_dien
    `;

    const params = [];

    if (user && user.role === "owner") {
      query += " WHERE owner_id = $1";
      params.push(user.id);
    }

    const result = await pool.query(query, params);
    return result.rows[0];
  },

  statsByRegion: async (user) => {
    let query = `
      SELECT khu_vuc, COUNT(*) as count
      FROM nhamay_dien
      WHERE khu_vuc IS NOT NULL
    `;

    const params = [];

    if (user && user.role === "owner") {
      query += " AND owner_id = $1";
      params.push(user.id);
    }

    query += ` GROUP BY khu_vuc ORDER BY count DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  },

  getStatsByOwner: async (ownerId) => {
    const result = await pool.query(
      `
      SELECT 
        COUNT(*) as total,
        SUM(cong_suat) as total_power,
        COUNT(*) FILTER (WHERE trang_thai = 'Hoạt động') as hoat_dong,
        COUNT(*) FILTER (WHERE trang_thai = 'Bảo trì') as bao_tri,
        COUNT(*) FILTER (WHERE trang_thai = 'Ngừng') as ngung
      FROM nhamay_dien
      WHERE owner_id = $1
    `,
      [ownerId],
    );

    return result.rows[0];
  },

  statsByRegionByOwner: async (ownerId) => {
    const result = await pool.query(
      `
      SELECT khu_vuc, COUNT(*) as count
      FROM nhamay_dien
      WHERE owner_id = $1 AND khu_vuc IS NOT NULL
      GROUP BY khu_vuc
    `,
      [ownerId],
    );

    return result.rows;
  },
};
