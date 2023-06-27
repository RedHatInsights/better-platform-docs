FROM registry.access.redhat.com/ubi8/nodejs-16
COPY . .
USER root
RUN chmod -R 777 components
RUN npm ci && node downloader/downloader.mjs && npm run build
EXPOSE 3000
USER 1001
CMD npm run start
