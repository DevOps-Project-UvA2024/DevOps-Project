# Stage-1 & specify a name 'builder'
FROM node:18.18.0 AS builder

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

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static files from the 'builder' stage to the Nginx folder to serve static content
COPY --from=builder /app/client/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
