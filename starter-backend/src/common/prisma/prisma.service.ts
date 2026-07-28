import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

/**
 * PrismaService
 *
 * Connects to the Neon Postgres database using the Neon serverless driver
 * (`@neondatabase/serverless`) routed through the official Prisma Neon adapter
 * (`@prisma/adapter-neon`).
 *
 * Why not the standard `pg` + `@prisma/adapter-pg` combo?
 * The Neon pooler is normally reached on port 5432, but some networks
 * (corporate firewalls, ISPs, public Wi-Fi) block outbound port 5432. The
 * Neon serverless driver tunnels the Postgres protocol over WebSockets on
 * port 443 (the HTTPS port, almost always open), so the app keeps working
 * regardless of the local network's port restrictions.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
     private readonly logger = new Logger(PrismaService.name);

     constructor() {
          // Neon's serverless driver reaches the database over WebSocket on port
          // 443. In Node.js we must provide a WebSocket implementation.
          neonConfig.webSocketConstructor = ws;

          const adapter = new PrismaNeon({
               connectionString: process.env.DATABASE_URL,
               // Keep connection attempts from hanging for the full default
               // timeout when the network is unhealthy.
               connectionTimeoutMillis: 15000,
          });
          super({
               adapter,
               log: ['warn', 'error'],
          });
     }

     async onModuleInit(): Promise<void> {
          await this.$connect();
          this.logger.log('✅ Prisma connected to database (Neon serverless / port 443)');
     }

     async onModuleDestroy(): Promise<void> {
          await this.$disconnect();
          this.logger.log('Prisma disconnected from database');
     }

     /**
      * Helper to apply soft-delete filter consistently across queries.
      */
     get softDeleteFilter() {
          return { deletedAt: null };
     }
}
