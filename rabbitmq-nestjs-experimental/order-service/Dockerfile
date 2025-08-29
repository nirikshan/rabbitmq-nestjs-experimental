FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies and build
RUN pnpm install && pnpm run build

# Copy .env and proto files to dist folder
RUN cp .env dist/ && \
    mkdir -p dist/src/proto && \
    cp -r src/proto/* dist/src/proto/ls

# Start the application
CMD ["node", "dist/main.js"]