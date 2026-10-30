import dotenv from 'dotenv';
import status from 'http-status';
import AppError from '../errors/AppError';

dotenv.config()

interface EnvConfig {
    PORT: string;
    DATABASE_URL: string;
    NODE_ENV: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    ADMIN_PASSWORD: string;
    ADMIN_EMAIL: string;
    FRONTEND_URL: string;
     JWT_SECRET: string;
     JWT_REFRESH_SECRET:string;
     BUNNY_API_KEY: string;
     JWT_RESET_EXPIRES: string;
    EMAIL_SENDER: {
        SMTP_HOST: string;
        SMTP_PORT: string;
        SMTP_USER: string;
        SMTP_PASS: string;
        SMTP_FROM: string;
    };
}

const loadEnvVar = (): EnvConfig => {
    const requiredVars = [
        'DATABASE_URL',
        'NODE_ENV',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'ADMIN_PASSWORD',
        'ADMIN_EMAIL',
        'FRONTEND_URL',
         "JWT_SECRET",
         "JWT_RESET_EXPIRES",
         "JWT_REFRESH_SECRET",
        "GOOGLE_CALLBACK_URL",
        "BUNNY_API_KEY",
        'EMAIL_SENDER_SMTP_HOST',
        'EMAIL_SENDER_SMTP_PORT',
        'EMAIL_SENDER_SMTP_USER',
        'EMAIL_SENDER_SMTP_PASS',
        'EMAIL_SENDER_SMTP_FROM',
    ];

    const missingVars: string[] = [];
    requiredVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            missingVars.push(envVar);
        }
    });

    if (missingVars.length > 0) {
        console.error('❌ Missing critical environment variables:', missingVars.join(', '));
        throw new AppError(
            status.INTERNAL_SERVER_ERROR,
            `Deployment failed: Missing environment variable(s): ${missingVars.join(
                ', '
            )}. Please add them to your Vercel Project Settings.`
        );
    }

    return {
        PORT: process.env.PORT || '7000',
        NODE_ENV: process.env.NODE_ENV!,
        DATABASE_URL: process.env.DATABASE_URL!,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
        FRONTEND_URL: process.env.FRONTEND_URL!,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL!,
        JWT_SECRET: process.env.JWT_SECRET!,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
        BUNNY_API_KEY: process.env.BUNNY_API_KEY!,
        JWT_RESET_EXPIRES: process.env.JWT_RESET_EXPIRES!,
        EMAIL_SENDER: {
            SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST!,
            SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT!,
            SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER!,
            SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS!,
            SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM!,
        }
    };
};

export const env = loadEnvVar();