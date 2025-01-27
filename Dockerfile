FROM node:lts-slim AS builder

ARG APP_ENVIONMENT=production

# Set the NODE_OPTIONS environment variable to increase memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:lts-slim

ENV NODE_ENV production

# Create app directory
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app
WORKDIR /usr/src/app
USER root

# Install app dependencies
COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD [ "node", "dist/app.js" ]
