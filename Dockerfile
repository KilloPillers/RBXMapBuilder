# Use an official Node.js image as a base for building the front end
FROM node:18 as frontend-builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install front-end dependencies
RUN npm install

# Copy the rest of the front-end source code
COPY . .

# Build the front end
RUN npm run build

# Use an official Rust image as a base
FROM rust:latest as builder

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    libwebkit2gtk-4.0-dev \
    libsoup2.4-dev \
    pkg-config \
    build-essential

# Set the working directory
WORKDIR /app

# Copy the Cargo.toml and Cargo.lock files
COPY ./src-tauri/Cargo.toml ./src-tauri/Cargo.lock ./

# Create a dummy main.rs file to build the dependencies
RUN mkdir src-tauri/src -p
RUN echo "fn main() {}" > src-tauri/src/main.rs

# Build the dependencies
RUN cargo build --release
RUN rm -rf src-tauri/src

# Copy the source code
COPY . .

# Build the Tauri app
RUN cargo build --release

# Use a smaller base image for the final container
FROM ubuntu:22.04

# Install necessary dependencies for running the app
RUN apt-get update && apt-get install -y \
    libwebkit2gtk-4.0-37 \
    libgtk-3-0 \
    libayatana-appindicator3-1 \
    libx11-xcb1 \
    && rm -rf /var/lib/apt/lists/*

# Copy the built binary from the builder stage
COPY --from=builder /app/target/release/mapbuilder /usr/local/bin/mapbuilder

# Set the entrypoint to run the app
ENTRYPOINT ["mapbuilder"]

