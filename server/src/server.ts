import { Server } from 'http';
import { env } from './app/config/env';
import { closeDatabase, connectDatabase } from './app/config/database';
import app from './app';
// import './app/modules/coupon/coupon.cron'; // এটি সরাসরি ইমপোর্ট করুন
// import { cronScheduler } from './app/modules/coupon/coupon.cron';

let server: Server;

async function main() {
    try {
        await connectDatabase();
        // 👇 important line
        //    cronScheduler(); // ক্রন কাজ শুরু করুন

        server = app.listen(env.PORT, () => {
            console.log(`🚀 Server is listening on port ${env.PORT}`);
        });
    } catch (err) {
        // console.error('❌ Failed to start server:', err);
        await closeDatabase()
        process.exit(1);
    }
}

main();

// Graceful shutdown handlers
process.on('unhandledRejection', async (err) => {
    // console.log(`😈 Unhandled Rejection detected, shutting down...`, err);
    if (server) {
        server.close(async () => {
            await closeDatabase()
            process.exit(1);
        });
    } else {
        await closeDatabase()
        process.exit(1);
    }
});

process.on('uncaughtException', async (err) => {
    await closeDatabase();
    // console.log(`😈 Uncaught Exception detected, shutting down...`, err);
    process.exit(1);
});

// Handle SIGTERM (e.g., from Docker or cloud platforms)
process.on('SIGTERM', async () => {
    // console.log('🛑 SIGTERM received, shutting down gracefully...');
    if (server) {
        server.close(async () => {
            await closeDatabase();
            // console.log('👋 Server closed');
            process.exit(0);
        });
    }
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
    // console.log('🛑 SIGINT received, shutting down gracefully...');
    if (server) {
        server.close(async () => {
            await closeDatabase();
            // console.log('👋 Server closed');
            process.exit(0);
        });
    }
});