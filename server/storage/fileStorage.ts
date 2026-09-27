import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface StorageResult {
  storagePath: string;
  publicUrl: string;
  fileName: string;
  sizeBytes: number;
  hash: string;
  mimeType: string;
}

export interface IFileStorage {
  saveFile(buffer: Buffer, originalName: string, mimeType: string): Promise<StorageResult>;
  getFile(storagePath: string): Promise<Buffer>;
  exists(storagePath: string): Promise<boolean>;
  deleteFile(storagePath: string): Promise<void>;
}

export class LocalDiskFileStorage implements IFileStorage {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir || path.join(process.cwd(), 'server', 'uploads');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async saveFile(buffer: Buffer, originalName: string, mimeType: string): Promise<StorageResult> {
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const ext = path.extname(originalName) || (mimeType.includes('pdf') ? '.pdf' : '.png');
    const safeName = `deed-${Date.now()}-${hash.substring(0, 8)}${ext}`;
    const targetPath = path.join(this.baseDir, safeName);

    await fs.promises.writeFile(targetPath, buffer);

    return {
      storagePath: targetPath,
      publicUrl: `/uploads/${safeName}`,
      fileName: originalName,
      sizeBytes: buffer.length,
      hash: `0x${hash}`,
      mimeType
    };
  }

  async getFile(storagePath: string): Promise<Buffer> {
    return fs.promises.readFile(storagePath);
  }

  async exists(storagePath: string): Promise<boolean> {
    return fs.existsSync(storagePath);
  }

  async deleteFile(storagePath: string): Promise<void> {
    if (fs.existsSync(storagePath)) {
      await fs.promises.unlink(storagePath);
    }
  }
}

// Default export singleton instance
export const fileStorage: IFileStorage = new LocalDiskFileStorage();
// FILE STORAGE SYSTEM FOR PRODUCTION.