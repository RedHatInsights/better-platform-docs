FROM registry.access.redhat.com/ubi8/nodejs-16
COPY . .
RUN rm -rf /node_modules
RUN npm i && npm run build
EXPOSE 3000
USER 1001
CMD npm run start
