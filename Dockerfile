# Build the Vue SPA
FROM node:22-alpine AS ui-builder
WORKDIR /ui
COPY ui/package.json ui/yarn.lock* ./
RUN yarn install --frozen-lockfile || yarn install
COPY ui/ .
RUN yarn build

# Build the Go backend
FROM golang:1.25-alpine AS go-builder
RUN apk add --no-cache upx
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags="-s -w" -o /out/app main.go \
    # && upx --best --lzma -q /out/app \
    && ls -lh /app

# Runtime data stage: provide CA certs + minimal timezone data for scratch
FROM alpine:3.20 AS runtime-data
RUN apk add --no-cache ca-certificates tzdata

# Runtime image
FROM scratch
WORKDIR /app
COPY --from=runtime-data /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=runtime-data /usr/share/zoneinfo/UTC /usr/share/zoneinfo/UTC
COPY --from=go-builder /out/app .
COPY --from=ui-builder /ui/dist ./public
COPY .env.docker ./.env
ENV TZ=UTC
EXPOSE 9001
CMD ["./app"]
