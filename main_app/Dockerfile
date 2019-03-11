FROM keymetrics/pm2:8-stretch

# Bundle APP files
COPY index.js .
COPY package.json .
COPY pm2.json .
COPY start.sh .
COPY helpers/common.js ./helpers/common.js
COPY helpers/mysql.js ./helpers/mysql.js
COPY helpers/redis.js ./helpers/redis.js


# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production
RUN mkdir -p /tmp/appd/proxy
RUN mkdir /tmp/appd/logs
RUN chmod 777 ./start.sh

#CMD [ "pm2", "start", "index.js", "-i", "4" ]
# CMD ["/bin/bash", "-c", "./start.sh"]

CMD [ "pm2-runtime", "start", "pm2.json" ]