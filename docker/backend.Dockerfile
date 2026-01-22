FROM node:20-alpine

WORKDIR /app

# copy package files first for better caching
COPY backend/package*.json ./

RUN npm ci --only=production

# copy source
COPY backend/ .

# build typescript
RUN npm run build

# create uploads dir
RUN mkdir -p uploads/models

EXPOSE 3010

CMD ["node", "dist/index.js"]
