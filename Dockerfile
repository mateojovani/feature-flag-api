FROM node:latest
RUN mkdir -p /usr/src/featflag
WORKDIR /usr/src/featflag
COPY package.json /usr/src/featflag/
RUN npm install
COPY . /usr/src/featflag
EXPOSE 8888
CMD [ "npm", "start" ]