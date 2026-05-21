const pool = require("../../db");

module.exports = {
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
        n.ngay_hoat_dong,
        l.ten_loai,
        ST_Y(n.vi_tri) as lat,
        ST_X(n.vi_tri) as lng,
        n.image
      FROM nhamay_dien n
      LEFT JOIN loai_nhamay l ON n.loai_id = l.id
    `);

    return result.rows;
  },

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
      ngay_hoat_dong,
    } = data;

    const result = await pool.query(
      `
      INSERT INTO nhamay_dien 
      (ten_nha_may, cong_suat, trang_thai, vi_tri, owner_id, tinh, khu_vuc, image, ngay_hoat_dong)
      VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($5, $4), 4326), $6, $7, $8, $9, $10)
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
        ngay_hoat_dong || null,
      ],
    );

    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM nhamay_dien WHERE id = $1", [id]);
  },

  update: async (id, data) => {
    const {
      ten_nha_may,
      cong_suat,
      trang_thai,
      tinh,
      khu_vuc,
      image,
      ngay_hoat_dong,
    } = data;

    if (image) {
      await pool.query(
        `
        UPDATE nhamay_dien
        SET ten_nha_may = $1,
            cong_suat = $2,
            trang_thai = $3,
            tinh = $4,
            khu_vuc = $5,
            image = $6,
            ngay_hoat_dong = $7
        WHERE id = $8
      `,
        [
          ten_nha_may,
          cong_suat,
          trang_thai,
          tinh,
          khu_vuc,
          image,
          ngay_hoat_dong || null,
          id,
        ],
      );
    } else {
      await pool.query(
        `
        UPDATE nhamay_dien
        SET ten_nha_may = $1,
            cong_suat = $2,
            trang_thai = $3,
            tinh = $4,
            khu_vuc = $5,
            ngay_hoat_dong = $6
        WHERE id = $7
      `,
        [ten_nha_may, cong_suat, trang_thai, tinh, khu_vuc, ngay_hoat_dong || null, id],
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
};
