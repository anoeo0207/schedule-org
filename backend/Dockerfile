# Use the official Node.js image as the base image
FROM node:22

# Create a directory for the app
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Set the working directory in the container
WORKDIR /home/node/app


# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

RUN chown -R node:node package*.json

# Change the user to node
USER node

# Install the app dependencies using package.json and package-lock.json
RUN npm install


# Copy the rest of the application code into the container
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "api.js"]