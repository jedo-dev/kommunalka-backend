# Stage 1: Install dependencies
FROM node:16.15.0 AS build-deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Set up app and start server
FROM build-deps AS app
COPY . .

# Expose the port the app runs on
EXPOSE 4444

# Run the app
CMD ["npm", "run", "start:dev"]
