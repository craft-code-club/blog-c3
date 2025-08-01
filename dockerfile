FROM node:24.4.1 AS build-env

WORKDIR /src

COPY package*.json ./
# Runs the "npm ci" command to install the dependencies specified in the package-lock.json file.
RUN npm install -g npm && npm ci

COPY . .
RUN npm run build



FROM nginx:1.29.0 AS prod-env

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-env /src/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
