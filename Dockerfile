# Use the official Node.js 16 base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json, package-lock.json, and the remaining app files to the working directory
COPY package*.json . /

# Install dependencies and TypeScript declarations for lodash, then build the app
RUN npm install \
    && npm install --save-dev @types/lodash \
    && npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
