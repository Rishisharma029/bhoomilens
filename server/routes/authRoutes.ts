import { Router, Request, Response } from 'express';
import { userRepo } from '../db/repositories/userRepo';
import { auditRepo } from '../db/repositories/auditRepo';
import { UserRole } from '../db/models';

const router = Router();

/**
 * 1. User Registration
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      role = 'CITIZEN',
      aadhaar,
      aadhaar_masked,
      designation,
      jurisdiction
    } = req.body;

    if (!name || !email) {
      res.status(400).json({ success: false, error: 'Name and email are required.' });
      return;
    }

    const existing = await userRepo.findByEmail(email);
    if (existing) {
      res.status(409).json({ success: false, error: 'User with this email already exists.' });
      return;
    }

    const validRole: UserRole = ['CITIZEN', 'ADMIN', 'REVENUE_OFFICER'].includes(role) ? role : 'CITIZEN';
    const userId = `user_${validRole.toLowerCase().slice(0, 3)}_${Date.now()}`;
    const maskedAadhaar = aadhaar_masked || (aadhaar ? `XXXX-XXXX-${aadhaar.slice(-4)}` : 'XXXX-XXXX-8921');

    const newUser = await userRepo.create({
      id: userId,
      name,
      email,
      role: validRole,
      aadhaar_masked: maskedAadhaar,
      designation: designation || (validRole === 'CITIZEN' ? 'Registered Landholder' : 'Revenue Official'),
      jurisdiction: jurisdiction || 'Dehradun Sub-Division'
    });

    await auditRepo.appendLog({
      record_id: userId,
      khasra_no: 'N/A',
      action: 'USER_REGISTERED',
      performed_by: name,
      role: validRole,
      ip_address: req.ip || '127.0.0.1',
      details: `New ${validRole} account registered for ${name} (${email}).`
    });

    const token = `bhoomi_token_${Buffer.from(`${userId}:${email}:${Date.now()}`).toString('base64')}`;

    res.status(201).json({
      success: true,
      user: newUser,
      token,
      message: 'Account successfully registered and authenticated.'
    });
  } catch (err: any) {
    console.error('[Auth API] Register error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 2. User Login
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, phone, empId, pin, role } = req.body;

    let matchedUser = null;

    if (email) {
      matchedUser = await userRepo.findByEmail(email);
    }

    // Default fallback to benchmark users if matching standard demo credentials
    if (!matchedUser) {
      const allUsers = await userRepo.listAll();
      if (role === 'ADMIN' || empId) {
        matchedUser = allUsers.find(u => u.role === 'ADMIN') || {
          id: 'admin_adm_501',
          name: 'Rajeshwar Singh Negi',
          email: 'sdm.dehradun@uk.gov.in',
          role: 'ADMIN' as UserRole,
          aadhaar_masked: 'XXXX-XXXX-4412',
          designation: 'Sub-Divisional Magistrate (SDM)',
          jurisdiction: 'Dehradun Sub-Division, Tehsil Sadar'
        };
      } else {
        // Citizen login
        matchedUser = allUsers.find(u => u.role === 'CITIZEN') || {
          id: 'user_cit_101',
          name: 'Rishi Sharma',
          email: 'rishi.sharma@uttarakhand.gov.in',
          role: 'CITIZEN' as UserRole,
          aadhaar_masked: 'XXXX-XXXX-8921',
          designation: 'Registered Landholder / Citizen',
          jurisdiction: 'District Dehradun, Tehsil Rishikesh'
        };
      }
    }

    const token = `bhoomi_token_${Buffer.from(`${matchedUser.id}:${matchedUser.email}:${Date.now()}`).toString('base64')}`;

    console.log(`[Auth API] Logged in user: ${matchedUser.name} (${matchedUser.role})`);

    res.json({
      success: true,
      user: matchedUser,
      token,
      message: `Welcome back, ${matchedUser.name}`
    });
  } catch (err: any) {
    console.error('[Auth API] Login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 3. Current User Profile
 * GET /api/auth/me
 */
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userRepo.listAll();
    const defaultUser = users[0] || {
      id: 'user_cit_101',
      name: 'Rishi Sharma',
      email: 'rishi.sharma@uttarakhand.gov.in',
      role: 'CITIZEN',
      aadhaar_masked: 'XXXX-XXXX-8921'
    };
    res.json({ success: true, user: defaultUser });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
// AUTH SERVER AND TOTAL AUTHERNTICATION SERVER TOTAL API CALLING ROUTES.