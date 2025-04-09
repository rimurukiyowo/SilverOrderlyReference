import type { NextConfig } from "next";
import { env } from "process";

const myArray = (process.env.SOME_ENV_VAR || '').split(',');

module.exports = nextConfig;
