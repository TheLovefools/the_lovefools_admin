###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20-alpine As Development
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm i
COPY --chown=node:node . .
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine As build
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
COPY ./.env ./
RUN npm run build
ENV NODE_ENV production
# RUN npm i --only=production && npm cache clean --force
RUN npm cache clean --force
USER node

###################
# PRODUCTION
###################

FROM node:20-alpine As production
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/.next ./.next
CMD npx next start