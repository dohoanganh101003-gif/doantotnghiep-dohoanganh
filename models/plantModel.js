const pool = require("../db");

const PlantModel = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT 
        n.id,
        n.ten_nha_may,
        n.cong_suat,
        n.trang_thai,
        n.owner_id,
        n.tinh,
        n.khu_vuc,
        l.ten_loai,
        ST_Y(n.vi_tri) as lat,
        ST_X(n.vi_tri) as lng,
        n.image
      FROM nhamay_dien n
      LEFT JOIN loai_nhamay l ON n.loai_id = l.id
    `);

    return result.rows;
  },

  // search
  search: async (keyword) => {
    const result = await pool.query(
      `
    SELECT 
      n.id,
      n.ten_nha_may,
      n.cong_suat,
      n.trang_thai,
      ST_Y(n.vi_tri) as lat,
      ST_X(n.vi_tri) as lng
    FROM nhamay_dien n
    WHERE to_tsvector('simple', unaccent(n.ten_nha_may))
          @@ plainto_tsquery('simple', unaccent($1))
    `,
      [keyword],
    );

    return result.rows;
  },

  create: async (data) => {
    const {
      ten_nha_may,
      cong_suat,
      trang_thai,
      lat,
      lng,
      owner_id,
      tinh,
      khu_vuc,
      image,
    } = data;

    const result = await pool.query(
      `
    INSERT INTO nhamay_dien 
    (ten_nha_may, cong_suat, trang_thai, vi_tri, owner_id, tinh, khu_vuc, image)
    VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($5, $4), 4326), $6, $7, $8, $9)
    RETURNING id
  `,
      [
        ten_nha_may,
        cong_suat,
        trang_thai,
        lat,
        lng,
        owner_id,
        tinh,
        khu_vuc,
        image,
      ],
    );

    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM nhamay_dien WHERE id = $1", [id]);
  },

  update: async (id, data) => {
    const { ten_nha_may, cong_suat, trang_thai, tinh, khu_vuc, image } = data;

    if (image) {
      await pool.query(
        `
      UPDATE nhamay_dien
      SET ten_nha_may = $1,
          cong_suat = $2,
          trang_thai = $3,
          tinh = $4,
          khu_vuc = $5,
          image = $6
      WHERE id = $7
    `,
        [ten_nha_may, cong_suat, trang_thai, tinh, khu_vuc, image, id],
      );
    } else {
      await pool.query(
        `
      UPDATE nhamay_dien
      SET ten_nha_may = $1,
          cong_suat = $2,
          trang_thai = $3,
          tinh = $4,
          khu_vuc = $5
      WHERE id = $6
    `,
        [ten_nha_may, cong_suat, trang_thai, tinh, khu_vuc, id],
      );
    }
  },

  getById: async (id) => {
    const result = await pool.query(
      `
      SELECT 
        id,
        ten_nha_may,
        cong_suat,
        trang_thai,
        owner_id,
        ST_Y(vi_tri) as lat,
        ST_X(vi_tri) as lng,
        image
      FROM nhamay_dien
      WHERE id = $1
      `,
      [id],
    );

    return result.rows[0];
  },

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

    if (user.role === "owner") {
      query += " WHERE owner_id = $1";
      params.push(user.id);
    }

    const result = await pool.query(query, params);
    return result.rows[0];
  },

  statsByProvince: async (user) => {
    let query = `
    SELECT tinh, COUNT(*) as count
    FROM nhamay_dien
    WHERE tinh IS NOT NULL
  `;

    const params = [];

    if (user.role === "owner") {
      query += " AND owner_id = $1";
      params.push(user.id);
    }

    query += `
    GROUP BY tinh
    ORDER BY count DESC
  `;

    const result = await pool.query(query, params);
    return result.rows;
  },

  statsByRegion: async (user) => {
    let query = `
    SELECT khu_vuc, COUNT(*) as count
    FROM nhamay_dien
    WHERE khu_vuc IS NOT NULL
  `;

    const params = [];

    if (user.role === "owner") {
      query += " AND owner_id = $1";
      params.push(user.id);
    }

    query += `
    GROUP BY khu_vuc
    ORDER BY count DESC
  `;

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

  statsByProvinceByOwner: async (ownerId) => {
    const result = await pool.query(
      `
    SELECT tinh, COUNT(*) as count
    FROM nhamay_dien
    WHERE owner_id = $1 AND tinh IS NOT NULL
    GROUP BY tinh
  `,
      [ownerId],
    );

    return result.rows;
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

module.exports = PlantModel;
