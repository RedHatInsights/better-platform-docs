# Getting started

foo

1. make sure you have an LTS node installed (16.x.x)
2. to test "external mode", make sure you have docker-compose installed and can pull images from https://quay.io

## Local development

1. install dependencies with `npm install`
2. run `node downloader/downloader.mjs` to download the doc files
3. run `npm run dev:compose` to kickstarts development server
4. open your browser at http://locahost:3000
5. add/change `.mdx?` files in the `pages` directory

## External development

1. In the desired repository add a `docker-compose.yml`. You can copy the `docker-compose.yml` from this repository.
2. In the copied `docker-compose.yml`, change the `<repo-name>` for your project name. The name will be used as a root section route.
3. In your project create `docs` directory.
4. In the `docs` directory create Markdown files with documentation content.
5. Run `docker-compose up` to spin the development environment.
6. Open your browser at `http://locahost:3000/<repo-name>`.
7. Continue editing content inside the `docs` directory.
