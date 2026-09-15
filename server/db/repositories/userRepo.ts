import { db } from '../client';
import { User, CreateUserInput } from '../models';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'server', 'data', 'users.json');

export const userRepo = {
  async listAll(): Promise<User[]> {
    if (db.isLivePostgres()) {
      const res = await db.query<User>(`SELECT * FROM users ORDER BY created_at ASC`);
      if (res.rows.length > 0) return res.rows;
    }
    try {
      if (fs.existsSync(USERS_FILE)) {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
      }
    } catch (e) {
      console.error('Error reading users file:', e);
    }
    return [];
  },

  async findById(id: string): Promise<User | null> {
    if (db.isLivePostgres()) {
      const res = await db.query<User>(`SELECT * FROM users WHERE id = $1`, [id]);
      if (res.rows.length > 0) return res.rows[0];
    }
    const all = await this.listAll();
    return all.find(u => u.id === id) || null;
  },

  async findByEmail(email: string): Promise<User | null> {
    if (db.isLivePostgres()) {
      const res = await db.query<User>(`SELECT * FROM users WHERE email = $1`, [email]);
      if (res.rows.length > 0) return res.rows[0];
    }
    const all = await this.listAll();
    return all.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async create(user: CreateUserInput): Promise<User> {
    const fullUser: User = {
      ...user,
      created_at: new Date().toISOString()
    };

    if (db.isLivePostgres()) {
      await db.query(
        `INSERT INTO users (id, name, email, role, aadhaar_masked, designation, jurisdiction, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           role = EXCLUDED.role,
           designation = EXCLUDED.designation,
           jurisdiction = EXCLUDED.jurisdiction`,
        [
          fullUser.id, fullUser.name, fullUser.email, fullUser.role,
          fullUser.aadhaar_masked || null, fullUser.designation || null,
          fullUser.jurisdiction || null, fullUser.created_at
        ]
      );
    }

    const all = await this.listAll();
    const existingIdx = all.findIndex(u => u.id === fullUser.id);
    if (existingIdx >= 0) {
      all[existingIdx] = fullUser;
    } else {
      all.push(fullUser);
    }

    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(all, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving users file:', e);
    }

    return fullUser;
  }
};
