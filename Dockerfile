# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the Docker image
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the Docker image
COPY package*.json ./

# Install the application's dependencies inside the Docker image
RUN npm install && npm uninstall bcrypt

# Copy the rest of your application's source files to the Docker image
COPY . .

# Install 'bcrypt' inside Docker, this ensures it is compiled to the correct architecture
RUN npm install bcrypt

# Expose port 8080 for the application
EXPOSE 8080

# Run the application when the Docker container launches
CMD ["npm", "seed"]

CMD ["node", "index.js"]
