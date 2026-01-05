import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private pool: Pool;
  public db: NodePgDatabase<typeof schema>;

  constructor() {
    const connectionString =
      'postgresql://eventflowapp:eventflowapp@localhost:12500/eventflowapp';
    this.pool = new Pool({ connectionString });
    this.db = drizzle(this.pool, { schema });
    console.log('DatabaseService connected');
  }
  onModuleDestroy() {
    this.pool.end();
  }

  get schema() {
    return schema;
  }
}
