FROM node:20-alpine AS builder

WORKDIR /app

ARG NUXT_PUBLIC_MEDIA_CDN
ENV NUXT_PUBLIC_MEDIA_CDN=${NUXT_PUBLIC_MEDIA_CDN:-/api/media} 


COPY package.json package-lock.json ./

RUN npm cache clean --force \
    && rm -rf ~/.npm \
    && npm ci --no-audit


COPY . .


RUN npm run build


FROM node:20-alpine AS runner

ENV NODE_ENV=production


RUN addgroup -g 1001 -S nuxt && adduser -S nuxt -u 1001

WORKDIR /app


COPY --from=builder /app/.output ./.output


RUN chown -R nuxt:nuxt /app
USER nuxt

EXPOSE 3000


CMD ["node", ".output/server/index.mjs"]
