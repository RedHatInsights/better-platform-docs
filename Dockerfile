FROM quay.io/cloudservices/releaser:6969d44
COPY . .
USER root
COPY ./Caddyfile /opt/app-root/src/Caddyfile
RUN chmod -R 777 components
RUN npm ci 
RUN node downloader/downloader.mjs
RUN npm run build
EXPOSE 3000 8000
# USER 1001
CMD ./start.sh
