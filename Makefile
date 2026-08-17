build_ui:
	cd ui && yarn
	cd ui && yarn build

build:
	rm -rf bin
	mkdir -p bin
	go build -o bin/app local.go

build_prod:
	rm -rf bin
	mkdir -p bin
	CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags="-s -w" -o bin/app local.go
	upx --best --lzma bin/app

start: build build_ui
	rm -rf bin/public
	mv ui/dist bin/public
	rm -rf bin/html
	cp -ar html bin
	cp .env bin
	cd bin && ./app

start_vercel: build_ui
	rm -rf public
	cp -r ui/dist public
	vercel dev -d

swag_init:
	~/go/bin/swag init