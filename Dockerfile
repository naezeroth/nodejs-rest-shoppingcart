FROM node:8 
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app 
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app/
EXPOSE 3000 
CMD [ "npm", "start" ]

# FROM node:8
# # Create app directory
# WORKDIR /usr/src/app
# # Install app dependencies
# COPY package*.json ./
# RUN npm install 
# # Copy app source code
# COPY . .
# #Expose port and start application
# EXPOSE 8080
# CMD [ "npm", "start" ]

# //expose port 3000 to mount it to another port in local machine 
# RUN npm install -g nodemon // install nodemon for changes on the fly
# CMD [ "nodemon", "index.js" ] // start server inside container

# FROM node:latest
# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app
# COPY package.json /usr/src/app/
# RUN npm install
# COPY . /usr/src/app
# EXPOSE 3000
# CMD [ “npm”, “start” ]