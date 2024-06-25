FROM quay.io/cloudservices/releaser:6969d44
COPY pages .github components config downloader \
generators hooks pages public server-assets server-search \
tmp watchers .eslintignore .eslitnrc.json .puppeteerrc.cjs \
build_deploy.sh Caddyfile next-env.dev next.config.mjs \
package.json pr_check.sh server.js start.sh tsconfig.json ./
USER root
COPY ./Caddyfile /opt/app-root/src/Caddyfile
RUN chmod -R 777 components
RUN chmod -R 777 server-search
RUN chmod -R 777 server-assets
RUN npm ci 
RUN node downloader/downloader.mjs
RUN npm run build
EXPOSE 3000 8000
# USER 1001
CMD ./start.sh
