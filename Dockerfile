FROM node

WORKDIR /usr/workroot/

COPY package.json .

RUN npm install

COPY . .

RUN rm -fr kube

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]