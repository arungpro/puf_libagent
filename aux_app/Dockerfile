FROM node:8.11.3

# Bundle APP files
COPY package.json .
COPY index.js .
RUN npm install --production

CMD ["node", "index.js"]