/// <reference types="node" />

// Ensure Node.js globals are available
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    PORT?: string;
    NODE_ENV?: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_EXPIRES_IN?: string;
    JWT_REFRESH_EXPIRES_IN?: string;
    ADMIN_JWT_SECRET: string;
    ADMIN_JWT_REFRESH_SECRET: string;
    ADMIN_JWT_EXPIRES_IN?: string;
    ADMIN_JWT_REFRESH_EXPIRES_IN?: string;
    FRONTEND_URL?: string;
  }
}

// Explicitly declare process and console as globals
declare const process: NodeJS.Process;
declare const console: Console;
