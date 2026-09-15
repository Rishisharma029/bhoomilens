import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');
const RECORDS_FILE = path.join(DATA_DIR, 'records.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const storageService = {
  getSubmissions(): any[] {
    try {
      if (fs.existsSync(SUBMISSIONS_FILE)) {
        const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading submissions file:', e);
    }
    return [];
  },

  saveSubmissions(subs: any[]): void {
    try {
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(subs, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving submissions file:', e);
    }
  },

  getSubmissionById(id: string): any | undefined {
    const subs = this.getSubmissions();
    return subs.find((s: any) => s.id === id);
  },

  saveSubmission(submission: any): any {
    const subs = this.getSubmissions();
    const idx = subs.findIndex((s: any) => s.id === submission.id);
    if (idx >= 0) {
      subs[idx] = submission;
    } else {
      subs.unshift(submission);
    }
    this.saveSubmissions(subs);
    return submission;
  },

  getRecords(): any[] {
    try {
      if (fs.existsSync(RECORDS_FILE)) {
        const raw = fs.readFileSync(RECORDS_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading records file:', e);
    }
    return [];
  },

  saveRecords(records: any[]): void {
    try {
      fs.writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving records file:', e);
    }
  }
};
