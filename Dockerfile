FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_BASE_URL=https://backend.espforpolice.vn
ARG VITE_API_GRADER_URL=https://grader.gsenglish.org
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_GRADER_URL=${VITE_API_GRADER_URL}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime

RUN apk add --no-cache gettext iproute2

COPY docker/docker-fe-entrypoint.sh /docker-fe-entrypoint.sh
RUN chmod +x /docker-fe-entrypoint.sh
COPY nginx/default.conf.template /templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["/docker-fe-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
