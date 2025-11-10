const fs = require('fs').promises;
const path = require('path');
const pool = require('../config/database.config');
const logger = require('../shared/utils/logger.util');

/**
 * Run all SQL migration files in order
 */
async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');
  
  try {
    logger.info('Starting database migrations...');
    
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();
    
    if (sqlFiles.length === 0) {
      logger.warn('No migration files found');
      return;
    }

    for (const file of sqlFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, 'utf-8');
      
      try {
        await pool.query(sql);
        logger.info(`✅ Migration executed: ${file}`);
      } catch (error) {
        logger.error(`❌ Migration failed: ${file}`, { error: error.message });
        throw error;
      }
    }
    
    logger.info('✅ All migrations completed successfully');
  } catch (error) {
    logger.error('Migration process failed', { error: error.message });
    throw error;
  }
}

/**
 * Run seed files to populate initial data
 */
async function runSeeds() {
  const seedsDir = path.join(__dirname, 'seeds');
  
  try {
    logger.info('Starting database seeding...');
    
    const files = await fs.readdir(seedsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();
    
    if (sqlFiles.length === 0) {
      logger.warn('No seed files found');
      return;
    }

    for (const file of sqlFiles) {
      const filePath = path.join(seedsDir, file);
      const sql = await fs.readFile(filePath, 'utf-8');
      
      try {
        await pool.query(sql);
        logger.info(`✅ Seed executed: ${file}`);
      } catch (error) {
        // Ignore duplicate entry errors for seeds
        if (error.code === 'ER_DUP_ENTRY') {
          logger.warn(`⚠️  Seed skipped (duplicate): ${file}`);
        } else {
          logger.error(`❌ Seed failed: ${file}`, { error: error.message });
          throw error;
        }
      }
    }
    
    logger.info('✅ All seeds completed successfully');
  } catch (error) {
    logger.error('Seeding process failed', { error: error.message });
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  (async () => {
    try {
      await runMigrations();
      await runSeeds();
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  })();
}

module.exports = { runMigrations, runSeeds };
