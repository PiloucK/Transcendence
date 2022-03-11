# Chose the base image
FROM    node

# Create the folder for the app
RUN     mkdir -p /usr/src/app/backend

# Make so all commands will run in the app's folder
WORKDIR /usr/src/app/backend

# Copy all package.json and install dependencies
COPY    package*.json ./
RUN     npm install

# Copy the app's files
COPY    . .

# Set the server access on port 8080
EXPOSE  8080

# Set the command to run the app at start
CMD     [ "npm", "start" ]
