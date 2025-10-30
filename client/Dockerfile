# Client Dockerfile for Development
#
# LEARNING NOTES:
# - Uses Node.js for building and running Vite dev server
# - Exposes port 5173 for Vite's dev server
# - Hot reload enabled via volume mounts in docker-compose

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start Vite dev server
# Host and polling configured in vite.config.ts
CMD ["npm", "run", "dev"]

