############
# Base
############
FROM node:16-buster-slim as base
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --production=false

############
# Build
############
FROM base as build
WORKDIR /app
COPY ./ ./
RUN npm run build

############
# Final
############
FROM base as final
ENV NODE_ENV=production
WORKDIR /app

# COPY package*.json ./
# RUN npm install --no-audit
# --only=prod

COPY tsconfig*.json ./
COPY ormconfig.ts ./
COPY --from=build /app/dist ./

EXPOSE 3000
CMD ["node", "src/main"]
