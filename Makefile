build_ui:
	cd ui && yarn
	cd ui && yarn build

build:
	rm -rf bin
	mkdir -p bin
	go build -o bin/app main.go

build_prod:
	rm -rf bin
	mkdir -p bin
	CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags="-s -w" -o bin/app main.go
	upx --best --lzma bin/app

start: build build_ui
	rm -rf bin/public
	mv ui/dist bin/public
	cp -ar html/german-vocabulary bin/public/german-vocabulary
	cp .env bin
	cd bin && ./app

start_vercel: build_ui
	rm -rf public
	cp -r ui/dist public
	cp -ar html/german-vocabulary public/german-vocabulary
	vercel dev -d

release_vercel: build_ui
	rm -rf public
	cp -r ui/dist public
	cp -ar html/german-vocabulary public/german-vocabulary
	vercel --prod

swag_init:
	~/go/bin/swag init