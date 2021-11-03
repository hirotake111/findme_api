FROM node:16.13 AS builder

#
# Build stage
#
# copy package.json and yarn.lock
WORKDIR /app
COPY *.json /app/
COPY ./yarn.lock /app/
# Install dev modules
# RUN npm install --also=dev
RUN yarn install --no-optional
# Copy and compile files
COPY src /app/src
# Transpile TypeScript files
RUN npm run build


#
# Production stage
#
FROM node:16.13
# Mark as production
ENV NODE_ENV=production
WORKDIR /app
# Add user
RUN groupadd -r user && useradd --no-log-init -r -g user user
# Copy files
COPY package*.json ./
COPY yarn.lock ./
# Install modules
RUN yarn install --production --no-optional
# Copy files from builder image to production image
COPY --from=builder /app/build /app/dist
# Change user
USER user
# Expose port
EXPOSE 3000
# Set the start-up command
CMD [ "node", "dist/server.js" ]