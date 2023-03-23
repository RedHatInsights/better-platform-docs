FROM registry.access.redhat.com/ubi8/nodejs-16
COPY . .
USER root
RUN chmod -R 777 components
RUN downloader/downloader.sh
RUN npm ci && npm run build
RUN rm -rf /node_modules
EXPOSE 3000
USER 1001
CMD npm run start
