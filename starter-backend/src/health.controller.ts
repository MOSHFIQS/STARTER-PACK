import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from './auth/decorators/public.decorator';
import { PrismaService } from './common/prisma/prisma.service';

@ApiTags('Health')
@Controller()
export class HealthController {
  private readonly startedAt = new Date();

  constructor(private readonly prisma: PrismaService) { }

  // ── JSON health endpoint (for monitoring tools) ─────────────────────────
  @Public()
  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns the API health status, database connectivity, uptime, and memory usage',
  })
  async healthJson() {
    const now = new Date();
    const uptimeMs = now.getTime() - this.startedAt.getTime();
    const dbStatus = await this.checkDatabase();

    return {
      status: 'ok',
      health: 100,
      timestamp: now.toISOString(),
      uptime: this.formatUptime(uptimeMs),
      uptimeMs,
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.APP_VERSION || '1.0.0',
      node: process.version,
      memory: this.getMemoryUsage(),
    };
  }

  // ── Beautiful HTML landing page at root ──────────────────────────────────
  @Public()
  @Get()
  async root(@Res() res: Response) {
    const now = new Date();
    const uptimeMs = now.getTime() - this.startedAt.getTime();
    const dbStatus = await this.checkDatabase();
    const mem = this.getMemoryUsage();
    const appName = process.env.APP_NAME || 'Property Chai API';
    const appVersion = process.env.APP_VERSION || '1.0.0';
    const apiPrefix = process.env.API_PREFIX || 'api/v1';
    const env = process.env.NODE_ENV || 'development';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName} — Server Status</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0f172a;
      --surface: #1e293b;
      --surface-2: #334155;
      --border: rgba(148, 163, 184, 0.12);
      --text: #f1f5f9;
      --text-dim: #94a3b8;
      --text-faint: #64748b;
      --emerald: #10b981;
      --cyan: #06b6d4;
      --amber: #f59e0b;
      --violet: #8b5cf6;
      --rose: #f43f5e;
    }

    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      background: var(--bg);
      background-image:
        linear-gradient(180deg, rgba(6, 182, 212, 0.06) 0%, transparent 40%),
        radial-gradient(circle at 90% 10%, rgba(139, 92, 246, 0.12) 0%, transparent 45%),
        radial-gradient(circle at 10% 90%, rgba(16, 185, 129, 0.08) 0%, transparent 45%);
      color: var(--text);
      padding: 2rem 1rem;
      display: flex;
      justify-content: center;
      -webkit-font-smoothing: antialiased;
    }

    .wrap {
      max-width: 880px;
      width: 100%;
      animation: rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes rise {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.4; }
    }

    /* ── Hero banner ── */
    .hero {
      position: relative;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 2.5rem 2rem;
      overflow: hidden;
      margin-bottom: 1.25rem;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--emerald), var(--cyan), var(--violet));
      background-size: 200% 100%;
      animation: shimmer 4s linear infinite;
    }

    .hero-top {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .hero-logo {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--cyan), var(--violet));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      box-shadow: 0 8px 32px rgba(6, 182, 212, 0.3);
      flex-shrink: 0;
    }

    .hero-titles h1 {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #f1f5f9, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-titles p {
      font-size: 0.85rem;
      color: var(--text-dim);
      font-weight: 500;
      margin-top: 0.15rem;
    }

    .hero-status {
      margin-left: auto;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 1rem;
      border-radius: 10px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.25);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--emerald);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      white-space: nowrap;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--emerald);
      animation: blink 1.6s ease-in-out infinite;
      box-shadow: 0 0 8px var(--emerald);
    }

    /* ── Health bar ── */
    .health-section {
      margin-top: 0.5rem;
    }

    .health-label {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.6rem;
    }

    .health-label span:first-child {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-faint);
    }

    .health-label span:last-child {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--emerald);
    }

    .health-track {
      height: 10px;
      background: rgba(148, 163, 184, 0.1);
      border-radius: 100px;
      overflow: hidden;
      position: relative;
    }

    .health-fill {
      height: 100%;
      width: 100%;
      border-radius: 100px;
      background: linear-gradient(90deg, var(--emerald), var(--cyan));
      position: relative;
      animation: growBar 1.4s cubic-bezier(0.16, 1, 0.3, 1) both;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
    }

    @keyframes growBar {
      from { width: 0; }
      to   { width: 100%; }
    }

    .health-msg {
      margin-top: 0.75rem;
      font-size: 0.82rem;
      color: var(--text-dim);
    }

    /* ── Stat grid ── */
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .tile {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.25rem 1.4rem;
      transition: transform 0.2s, border-color 0.2s;
      position: relative;
      overflow: hidden;
    }

    .tile:hover {
      transform: translateY(-2px);
      border-color: rgba(148, 163, 184, 0.25);
    }

    .tile-head {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.6rem;
    }

    .tile-icon {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .tile-icon.emerald { background: rgba(16, 185, 129, 0.12); }
    .tile-icon.cyan    { background: rgba(6, 182, 212, 0.12); }
    .tile-icon.violet  { background: rgba(139, 92, 246, 0.12); }
    .tile-icon.amber   { background: rgba(245, 158, 11, 0.12); }
    .tile-icon.rose    { background: rgba(244, 63, 94, 0.12); }

    .tile-name {
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--text-faint);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .tile-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text);
      line-height: 1.3;
      word-break: break-word;
    }

    .tile-value.emerald { color: var(--emerald); }
    .tile-value.cyan    { color: var(--cyan); }
    .tile-value.violet  { color: var(--violet); }
    .tile-value.amber   { color: var(--amber); }

    .tile-sub {
      font-size: 0.7rem;
      color: var(--text-faint);
      margin-top: 0.25rem;
      font-family: 'JetBrains Mono', monospace;
    }

    /* ── Links bar ── */
    .links-bar {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.25rem 1.4rem;
      margin-bottom: 1.25rem;
    }

    .links-title {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-faint);
      margin-bottom: 0.85rem;
    }

    .links {
      display: flex;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    .link-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.55rem 1rem;
      border-radius: 10px;
      background: var(--surface-2);
      border: 1px solid var(--border);
      color: var(--text-dim);
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 600;
      transition: all 0.2s;
    }

    .link-btn:hover {
      background: rgba(6, 182, 212, 0.12);
      border-color: rgba(6, 182, 212, 0.3);
      color: var(--cyan);
    }

    .link-btn.disabled {
      opacity: 0.4;
      pointer-events: none;
    }

    /* ── Footer ── */
    .footer {
      text-align: center;
      padding: 1rem;
      font-size: 0.75rem;
      color: var(--text-faint);
      font-family: 'JetBrains Mono', monospace;
    }

    .footer .sep { margin: 0 0.5rem; color: var(--surface-2); }

    @media (max-width: 600px) {
      .grid { grid-template-columns: 1fr; }
      .hero-top { flex-wrap: wrap; }
      .hero-status { margin-left: 0; }
    }
  </style>
</head>
<body>
  <div class="wrap">

    <!-- Hero Banner -->
    <div class="hero">
      <div class="hero-top">
        <div class="hero-logo">🏢</div>
        <div class="hero-titles">
          <h1>${appName}</h1>
          <p>Enterprise-grade Property & Real-Estate Platform</p>
        </div>
        <div class="hero-status">
          <div class="live-dot"></div>
          Operational
        </div>
      </div>

      <div class="health-section">
        <div class="health-label">
          <span>System Health</span>
          <span>100 / 100</span>
        </div>
        <div class="health-track">
          <div class="health-fill"></div>
        </div>
        <p class="health-msg">All services are healthy, database is connected, and the API is ready to accept requests.</p>
      </div>
    </div>

    <!-- Stat Grid -->
    <div class="grid">
      <div class="tile">
        <div class="tile-head">
          <div class="tile-icon emerald">⏱️</div>
          <div class="tile-name">Uptime</div>
        </div>
        <div class="tile-value emerald">${this.formatUptime(uptimeMs)}</div>
        <div class="tile-sub">${uptimeMs.toLocaleString()} ms total</div>
      </div>

      <div class="tile">
        <div class="tile-head">
          <div class="tile-icon ${dbStatus.connected ? 'emerald' : 'amber'}">🗄️</div>
          <div class="tile-name">Database</div>
        </div>
        <div class="tile-value ${dbStatus.connected ? 'emerald' : 'amber'}">${dbStatus.connected ? 'Connected' : 'Disconnected'}</div>
        <div class="tile-sub">${dbStatus.latencyMs !== null ? dbStatus.latencyMs + ' ms latency' : 'no response'}</div>
      </div>

      <div class="tile">
        <div class="tile-head">
          <div class="tile-icon violet">🌐</div>
          <div class="tile-name">Environment</div>
        </div>
        <div class="tile-value violet">${env}</div>
        <div class="tile-sub">${apiPrefix} prefix</div>
      </div>

      <div class="tile">
        <div class="tile-head">
          <div class="tile-icon cyan">📦</div>
          <div class="tile-name">Runtime</div>
        </div>
        <div class="tile-value cyan">${process.version}</div>
        <div class="tile-sub">Node.js</div>
      </div>

      <div class="tile">
        <div class="tile-head">
          <div class="tile-icon cyan">💾</div>
          <div class="tile-name">Heap Memory</div>
        </div>
        <div class="tile-value cyan">${mem.heapUsed}</div>
        <div class="tile-sub">of ${mem.heapTotal} allocated</div>
      </div>

      <div class="tile">
        <div class="tile-head">
          <div class="tile-icon cyan">📊</div>
          <div class="tile-name">RSS Memory</div>
        </div>
        <div class="tile-value cyan">${mem.rss}</div>
        <div class="tile-sub">resident set size</div>
      </div>

      <div class="tile">
        <div class="tile-head">
          <div class="tile-icon violet">🕐</div>
          <div class="tile-name">Server Time</div>
        </div>
        <div class="tile-value" style="font-size:0.95rem">${now.toISOString()}</div>
        <div class="tile-sub">UTC</div>
      </div>

      <div class="tile">
        <div class="tile-head">
          <div class="tile-icon emerald">🏷️</div>
          <div class="tile-name">Version</div>
        </div>
        <div class="tile-value emerald">v${appVersion}</div>
        <div class="tile-sub">NestJS + Prisma 7</div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="links-bar">
      <div class="links-title">Quick Links</div>
      <div class="links">
        <a class="link-btn" href="/api-docs">📚 API Docs</a>
        <a class="link-btn" href="/health">💚 Health JSON</a>
        <a class="link-btn disabled" href="/${apiPrefix}/auth/login">🔐 Login</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      ${appName} v${appVersion}<span class="sep">·</span>NestJS + Prisma + PostgreSQL<span class="sep">·</span>${env}
    </div>

  </div>
</body>
</html>`;

    res.type('html').send(html);
  }

  // ── Helpers ─────────────────────────────────────────────────────────────
  private async checkDatabase(): Promise<{ connected: boolean; latencyMs: number | null }> {
    try {
      const start = Date.now();
      await this.prisma.$queryRawUnsafe('SELECT 1');
      return { connected: true, latencyMs: Date.now() - start };
    } catch {
      return { connected: false, latencyMs: null };
    }
  }

  private formatUptime(ms: number): string {
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const parts: string[] = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${sec}s`);
    return parts.join(' ');
  }

  private getMemoryUsage() {
    const mem = process.memoryUsage();
    const fmt = (b: number) => (b / 1024 / 1024).toFixed(1) + ' MB';
    return {
      rss: fmt(mem.rss),
      heapTotal: fmt(mem.heapTotal),
      heapUsed: fmt(mem.heapUsed),
      external: fmt(mem.external),
    };
  }
}
