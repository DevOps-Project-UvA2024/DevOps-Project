# Stage-1 & specify a name 'builder'
FROM node:20-alpine3.17 AS builder

# Set the working directory inside the builder stage to /app/client
WORKDIR /app/client

# Copy the client's package.json file to the current directory to install the necessary dependencies
COPY client/package.json .

# Install the dependencies
RUN npm install

# Copy the rest of the frontend code into the /app/client directory
COPY client/ .

# Build and optimize static files
RUN npm run build

# Stage-2
FROM nginx:1.25.2-alpine-slim

# Copy the static files from the 'builder' stage to the Nginx folder to serve static content
COPY --from=builder /app/client/build /usr/share/nginx/html

# Open the port to serve the React app, default for HTTP
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
