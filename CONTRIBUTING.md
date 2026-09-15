# Contributing to BhoomiLens 🇮🇳

Thank you for your interest in contributing to **BhoomiLens (SIH26018 - Intelligent Land Record Digitalization & Verification Engine)**!

## Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rishisharma029/bhoomilens.git
   cd bhoomilens
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start backend service & development server**:
   ```bash
   # Option A: Start frontend + backend simultaneously
   npm run dev:all

   # Option B: Run in separate terminals
   npm run server   # Express API backend on :5000
   npm run dev      # Vite frontend dev server on :5173
   ```

4. **Verify TypeScript build & tests**:
   ```bash
   npm run build
   npx tsx server/test_ocr_pipeline.ts
   ```

## Pull Request Guidelines

- Ensure your branch is up-to-date with `main`.
- Write meaningful commit messages adhering to [Conventional Commits](https://www.conventionalcommits.org/).
- Ensure `npm run build` runs with zero TypeScript or Vite bundle errors.
- Ensure all 8 deterministic validation rules pass cleanly.

## Reporting Issues

Open an issue on GitHub describing:
- Clear steps to reproduce the bug
- Expected vs. actual behavior
- Screenshot or logs
