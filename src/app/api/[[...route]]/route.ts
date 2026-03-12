import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// DATABASE
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

const JWT_SECRET =
  process.env.JWT_SECRET || 'bwp_platform_super_secret_key_2026';

// EMAIL
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

// AUTH CHECK
async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
    };

    return decoded;
  } catch {
    return null;
  }
}

// INIT DB
async function initDb() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address TEXT,
        country VARCHAR(100),
        user_type VARCHAR(20) DEFAULT 'individual',
        company_name VARCHAR(255),
        company_location TEXT,
        company_phone VARCHAR(50),
        is_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        reset_token VARCHAR(255),
        profile_image TEXT,
        api_token VARCHAR(255) UNIQUE,
        mfa_enabled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS devices (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        ip VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        os VARCHAR(100),
        department VARCHAR(100),
        cpu INTEGER,
        ram INTEGER,
        disk INTEGER,
        protection_active BOOLEAN DEFAULT TRUE,
        vulnerabilities TEXT[],
        policies TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS incidents (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        severity VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        target VARCHAR(255) NOT NULL,
        target_type VARCHAR(50) NOT NULL,
        department VARCHAR(100),
        timestamp VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database initialized');
  } catch (err) {
    console.error('DB init error', err);
  } finally {
    client.release();
  }
}

initDb();

// =========================
// GET
// =========================

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log('GET:', pathname);

  // EMAIL VERIFY
  if (pathname.match(/\/api\/auth\/verify\/.+/)) {
    const segments = pathname.split('/');
    const token = segments[segments.length - 1];

    console.log('Verifying token:', token);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token inválido'
        },
        { status: 400 }
      );
    }

    try {
      const result = await pool.query(
        `
        UPDATE users
        SET is_verified = TRUE,
            verification_token = NULL
        WHERE verification_token = $1
        RETURNING id
      `,
        [token]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'Token inválido o cuenta ya verificada'
          },
          { status: 400 }
        );
      }

      console.log('User verified:', result.rows[0].id);

      return NextResponse.redirect(
        `${process.env.APP_URL || 'https://bii-delta.vercel.app'}/login?verified=true`
      );
    } catch (err: any) {
      console.error('Verification error:', err);

      return NextResponse.json(
        {
          success: false,
          message: err.message
        },
        { status: 500 }
      );
    }
  }

  // DEVICES
  if (pathname === '/api/devices') {
    const user = await verifyAuth(request);

    if (!user)
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );

    const result = await pool.query(
      'SELECT * FROM devices WHERE user_id=$1 ORDER BY created_at DESC',
      [user.id]
    );

    return NextResponse.json(result.rows);
  }

  // INCIDENTS
  if (pathname === '/api/incidents') {
    const user = await verifyAuth(request);

    if (!user)
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );

    const result = await pool.query(
      'SELECT * FROM incidents WHERE user_id=$1 ORDER BY created_at DESC',
      [user.id]
    );

    return NextResponse.json(result.rows);
  }

  return NextResponse.json(
    { success: false, message: 'Ruta no encontrada' },
    { status: 404 }
  );
}

// =========================
// POST
// =========================

export async function POST(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const body = await request.json();

  // REGISTER
  if (pathname === '/api/auth/register') {
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Campos requeridos' },
        { status: 400 }
      );
    }

    const exists = await pool.query(
      'SELECT id FROM users WHERE email=$1',
      [email]
    );

    if (exists.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Correo ya registrado' },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const verificationToken = crypto
      .randomBytes(32)
      .toString('hex');

    const apiToken =
      'BWP-' +
      Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

    await pool.query(
      `
      INSERT INTO users
      (name,email,password,verification_token,api_token)
      VALUES($1,$2,$3,$4,$5)
    `,
      [name, email, hashed, verificationToken, apiToken]
    );

    const verificationUrl = `${process.env.APP_URL}/api/auth/verify/${verificationToken}`;

    await transporter.sendMail({
      from: `"BWP Security" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: 'Verifica tu cuenta',
      html: `
      <h2>Verifica tu cuenta</h2>
      <a href="${verificationUrl}">
      Verificar cuenta
      </a>
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Revisa tu correo para verificar tu cuenta'
    });
  }

  // LOGIN
  if (pathname === '/api/auth/login') {
    const { email, password } = body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );

    if (result.rows.length === 0)
      return NextResponse.json(
        { success: false, message: 'Credenciales inválidas' },
        { status: 400 }
      );

    const user = result.rows[0];

    if (!user.is_verified) {
      return NextResponse.json(
        {
          success: false,
          message: 'Verifica tu correo primero'
        },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match)
      return NextResponse.json(
        { success: false, message: 'Credenciales inválidas' },
        { status: 400 }
      );

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    delete user.password;

    return NextResponse.json({
      success: true,
      token,
      user
    });
  }

  return NextResponse.json(
    { success: false, message: 'Ruta no encontrada' },
    { status: 404 }
  );
}
