!/bin/bash
# nohup node_modules/appdynamics-proxy/proxy/runProxy -j node_modules/appdynamics-jre/jre -- /tmp/appd/proxy /tmp/appd/logs &
pm2-runtime start pm2.json