# Multi-stage build for Vite React app
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN npm install

# Copy source and build
COPY . .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
	VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
RUN npm run build

# Production image with nginx to serve static assets
FROM nginx:1.27-alpine AS runner
WORKDIR /usr/share/nginx/html

# Clean default static files and copy built assets
RUN rm -rf ./*
COPY --from=builder /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
