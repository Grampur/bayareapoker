const { Pool } = require('pg');
require('dotenv').config();

class Database {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });

        // Test the connection
        this.pool.connect((err, client, release) => {
            if (err) {
                console.error('Error connecting to database:', err);
            } else {
                console.log('Connected to PostgreSQL database');
                release();
            }
        });
    }

    // Generic query method
    async query(sql, params = []) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(sql, params);
            return result.rows;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    // Generic run method for INSERT, UPDATE, DELETE
    async run(sql, params = []) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(sql, params);
            return {
                id: result.rows[0]?.id,
                rowCount: result.rowCount,
                rows: result.rows
            };
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    async close() {
        await this.pool.end();
    }
}

module.exports = new Database();