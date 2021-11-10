
# Stage 1
FROM node:12 as build-step
RUN mkdir -p /app/edumepwa
WORKDIR /app/edumepwa

COPY package.json /app/edumepwa
RUN npm install
COPY . /app/edumepwa
RUN npm run build
# Stage 2
FROM nginx
EXPOSE 3000
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /app/edumepwa/dist/edumepwa /usr/share/nginx/html

