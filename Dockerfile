FROM jrottenberg/ffmpeg:4.1-alpine AS ffmpeg
FROM node:20-alpine3.17

COPY --from=ffmpeg / /

# Create app directory
WORKDIR /usr/src/app

# Download dependencies
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon

# Start application
COPY . .
EXPOSE ${PORT}

CMD [ "nodemon", "src/index.js", "--no-stdin" ]
