FROM node

RUN npm install -g npm

WORKDIR /usr/workroot/

COPY package-lock.json .
COPY package.json .

RUN npm ci

COPY . .

RUN rm -fr kube

EXPOSE 3000

CMD [ "npm", "run", "start" ]