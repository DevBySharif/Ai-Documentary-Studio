# RUN APPLICATION — AI DOCUMENTARY STUDIO

## Prerequisites
- **Node.js**: `>= 18.0.0` (Tested on `v24.15.0`)
- **pnpm**: `>= 8.0.0` (Tested on `v9.15.9`)

---

## Installation

```bash
npm install -g pnpm@9
pnpm install
pnpm run build
```

---

## Service Commands & Expected URLs

### 1. REST API Server (`@studio/api`)
```bash
pnpm --filter @studio/api dev
```
- **Port**: `3001`
- **Health Check URL**: `http://localhost:3001/api/health`
- **Expected Health Response**: `{"status":"ok","timestamp":"..."}`

---

### 2. Web Application (`@studio/web`)
```bash
pnpm --filter @studio/web dev
```
- **Port**: `5173`
- **Application URL**: `http://localhost:5173`
- **Rendered View**: Login Screen / Dashboard Workspace

---

### 3. Desktop Application (`@studio/desktop`)
```bash
pnpm --filter @studio/desktop start
```
- **Desktop Launch Command**: `pnpm --filter @studio/desktop start`
- **Rendered View**: Electron Main Window with Multi-Pane Workspace & Timeline Studio

---

### 4. Concurrent Launch (All Monorepo Services)
```bash
pnpm run dev
```

---

## Troubleshooting

1. **Missing Electron Binary**:
   - Run `pnpm rebuild electron` or reinstall `pnpm@9`.
2. **Port Conflict on 3001 or 5173**:
   - Set custom `PORT` in `.env` or terminate process occupying port 3001 / 5173.
3. **Module Resolution Errors**:
   - Ensure `pnpm run build` is run once after pulling new packages so workspace package exports are built into `dist`.
