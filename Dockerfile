# Use official Node.js image
FROM node:14

# Create and set the app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port
EXPOSE 4000

# Start the app
CMD [ "node", "app.js" ]
