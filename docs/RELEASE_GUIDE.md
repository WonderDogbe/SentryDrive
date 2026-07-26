# SentryDrive Release & Download Tracking Guide

This document outlines the procedure for adding new releases (e.g. `v0.5.0` or `v1.0.0`) to the SentryDrive platform without resetting or overwriting past download statistics.

---

## Data Model Architecture

The download tracking system stores metrics in a normalized `ReleaseDownload` database model:

```ts
interface ReleaseDownload {
  id: string;
  version: string;       // e.g. "0.5.0"
  platform: string;      // "windows" | "macOS" | "linux"
  downloadCount: number; // Starts at 0 for new releases
  downloadUrl: string;   // URL to installer binary
  isLatest: boolean;     // Set to true for current release
  releasedAt: Date;
}
```

### Cumulative Lifetime Calculation

The landing page and public APIs calculate lifetime downloads dynamically:

$$\text{Lifetime Downloads} = \sum_{\text{all releases and platforms}} \text{downloadCount}$$

When a new version is published:
- Historical download counts for previous versions (e.g. `v0.1.0`, `v0.2.0`, `v0.3.0`, `v0.4.0`) remain unchanged in the database.
- The new version (`v0.5.0`) is added with `downloadCount: 0`.
- The total lifetime count equals the sum of previous downloads plus new version downloads.

---

## Adding a New Release

To publish a new version (e.g., `v0.5.0` for Windows):

### Option 1: Database Admin / SQL Script

Execute an upsert SQL query or Prisma client statement:

```ts
// 1. Unmark previous latest release
await prisma.releaseDownload.updateMany({
  where: { platform: "windows", isLatest: true },
  data: { isLatest: false },
});

// 2. Insert new release version starting at 0 downloads
await prisma.releaseDownload.create({
  data: {
    version: "0.5.0",
    platform: "windows",
    downloadCount: 0,
    downloadUrl: "/api/download/file?v=0.5.0",
    isLatest: true,
    releasedAt: new Date(),
  },
});
```

### Option 2: Updating seed file (`prisma/seed.ts`)

Add the new version entry to `initialReleases` in `prisma/seed.ts` set to `isLatest: true`, set previous versions to `isLatest: false`, and run:

```bash
npx prisma db seed
```

---

## Verification

1. Query `GET /api/downloads`
   - Verify `"currentVersion"` equals `"0.5.0"`.
   - Verify `"totalDownloads"` includes historical counts.
2. Trigger `GET /api/download/windows`
   - Verify `v0.5.0` download counter increments by 1.
   - Verify `v0.4.0` download counter remains untouched.
