import pool from './db.js';
import bcrypt from 'bcrypt';

const seedAdmin = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    const query = `
            INSERT INTO usuarios (rut, nombres, apellidos, email, password_hash, rol, cargo)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (email) DO NOTHING;
        `;

    const values = [
      '12.345.678-9',
      'Admin',
      'Principal',
      'admin@braco.cl',
      passwordHash,
      'admin',
      'Director de RRHH',
    ];

    await pool.query(query, values);
    console.log('✅ Usuario Administrador creado (admin@braco.cl / admin123)');
    process.exit();
  } catch (err) {
    console.error('❌ Error en el seeder:', err);
    process.exit(1);
  }
};

seedAdmin();
