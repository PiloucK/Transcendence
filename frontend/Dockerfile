# Chose the base image
FROM    node:latest

# Create the folder for the app
RUN     mkdir -p /usr/src/app/frontend

# Make so all commands will run in the app's folder
WORKDIR /usr/src/app/frontend

# Copy all package.json and install dependencies
COPY    package*.json ./
COPY    yarn.lock ./
RUN     yarn

# Copy the app's files
COPY    . .

# Set the server access on port 3000
EXPOSE  3000

# Set the command to run the app at start
CMD     [ "yarn", "dev" ]
