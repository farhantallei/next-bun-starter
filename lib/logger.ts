import winston from "winston"

import { env } from "@/data/env/server"

const { combine, timestamp, printf, colorize } = winston.format

const logFormat = printf(({ level, message, timestamp }) => {
  return ` [${timestamp}] ${level}: ${message}`
})

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: combine(timestamp(), colorize({ all: true }), logFormat),
  transports: [new winston.transports.Console()],
})
