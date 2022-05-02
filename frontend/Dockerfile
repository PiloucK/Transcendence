# Choose the base image
FROM    node:18

# Create the folder for the app
RUN     mkdir -p /usr/src/app/frontend

# Make so all commands will run in the app's folder
WORKDIR /usr/src/app/frontend

# Install dependencies
COPY    package*.json ./
RUN     npm install

# Copy the app's files
COPY    . .

# Set the server access on port 3000
EXPOSE  3000

# Set the command to run the app at start
CMD     [ "npm", "run", "dev" ]
# change for "npm run start" when development is finished?
