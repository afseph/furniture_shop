FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./

RUN npm install --force

COPY .env.prod .env

COPY . .
RUN npm run build

# Stage 2: creating nginx.conf
FROM nginx:alpine

COPY nginx_conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]