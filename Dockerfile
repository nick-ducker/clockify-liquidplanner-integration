FROM node:16-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build \
  && npm prune --production

FROM node:16-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=development /usr/src/app/package*.json /usr/src/app/
COPY --from=development /usr/src/app/node_modules/ /usr/src/app/node_modules/
COPY --from=development /usr/src/app/dist/ /usr/src/app/dist/

CMD ["node", "dist/main.js"]