const pool = require("../../db");

module.exports = {
  // Lấy log theo id nhà máy (dùng cho popup bản đồ)
  getByPlantId: async (plantId) => {
    const result = await pool.query(
      `SELECT 
        l.id,
        l.action,
        l.ghi_chu,
        l.created_at,
        u.username
       FROM nhamay_logs l
       LEFT JOIN users u ON u.id = l.user_id
       WHERE l.nhamay_id = $1
       ORDER BY l.created_at DESC
       LIMIT 10`,
      [plantId],
    );
    return result.rows;
  },

  // Ghi log khi có thay đổi
  create: async ({ nhamay_id, action, ghi_chu, user_id }) => {
    await pool.query(
      `INSERT INTO nhamay_logs (nhamay_id, action, ghi_chu, user_id)
       VALUES ($1, $2, $3, $4)`,
      [nhamay_id, action, ghi_chu || null, user_id || null],
    );
  },

  getPlantList: async (role, owner_id) => {
    if (role === "admin") {
      const result = await pool.query(`
        SELECT
          n.id,
          n.ten_nha_may,
          n.trang_thai,
          n.cong_suat,
          n.khu_vuc,
          COUNT(l.id) as tong_log
        FROM nhamay_dien n
        LEFT JOIN nhamay_logs l ON l.nhamay_id = n.id
        GROUP BY n.id
        ORDER BY n.ten_nha_may ASC
      `);
      return result.rows;
    } else if (role === "owner") {
      const result = await pool.query(
        `
        SELECT
          n.id,
          n.ten_nha_may,
          n.trang_thai,
          n.cong_suat,
          n.khu_vuc,
          COUNT(l.id) as tong_log
        FROM nhamay_dien n
        LEFT JOIN nhamay_logs l ON l.nhamay_id = n.id
        WHERE n.owner_id = $1
        GROUP BY n.id
        ORDER BY n.ten_nha_may ASC
      `,
        [owner_id],
      );
      return result.rows;
    } else {
      // user thường: tất cả nhà máy nhưng không có cột log chi tiết
      const result = await pool.query(`
        SELECT
          n.id,
          n.ten_nha_may,
          n.trang_thai,
          n.cong_suat,
          n.khu_vuc
        FROM nhamay_dien n
        ORDER BY n.ten_nha_may ASC
      `);
      return result.rows;
    }
  },

  getLogsByPlantAndTime: async ({
    plantId,
    tu_ngay,
    den_ngay,
    role,
    owner_id,
  }) => {
    const params = [plantId];
    let idx = 2;
    const where = ["l.nhamay_id = $1"];

    if (tu_ngay) {
      where.push(`l.created_at >= $${idx++}`);
      params.push(tu_ngay);
    }
    if (den_ngay) {
      where.push(`l.created_at <= $${idx++}`);
      params.push(den_ngay + " 23:59:59");
    }

    // Owner chỉ xem nhà máy của mình
    if (role === "owner") {
      where.push(`n.owner_id = $${idx++}`);
      params.push(owner_id);
    }

    const whereStr = where.join(" AND ");

    if (role === "admin" || role === "owner") {
      const result = await pool.query(
        `
        SELECT
          l.id,
          l.action,
          l.ghi_chu,
          l.created_at,
          n.trang_thai,
          u.username
        FROM nhamay_logs l
        LEFT JOIN nhamay_dien n ON n.id = l.nhamay_id
        LEFT JOIN users u ON u.id = l.user_id
        WHERE ${whereStr}
        ORDER BY l.created_at DESC
      `,
        params,
      );
      return result.rows;
    } else {
      // user thường: ẩn action/ghi chú/người thực hiện
      const result = await pool.query(
        `
        SELECT
          l.id,
          l.created_at,
          n.trang_thai
        FROM nhamay_logs l
        LEFT JOIN nhamay_dien n ON n.id = l.nhamay_id
        WHERE ${whereStr}
        ORDER BY l.created_at DESC
      `,
        params,
      );
      return result.rows;
    }
  },
};
