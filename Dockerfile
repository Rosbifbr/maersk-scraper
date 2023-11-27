FROM node:19-alpine 
RUN mkdir -p /srv
WORKDIR /srv

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD npm start
