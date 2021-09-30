FROM node:14.16.1-slim

# Install tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

WORKDIR /src

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN chmod +x /src/scripts/entrypoints.sh

RUN yarn build

ENTRYPOINT ["/tini","-sg","--","/src/scripts/entrypoints.sh"]

