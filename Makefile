clean:
	rm -rf node_modules

yalc:
	cd tooling/packages/dscc-scripts && yalc publish
	cd tooling/packages/dscc-validation && yalc publish
	cd tooling/packages/dscc-gen && yalc publish

	yalc add @google/dscc-scripts
	yalc add @google/dscc-validation
	yalc add @google/dscc-gen

install:
	yarn install

build-post:
	# jq를 사용하여 ./build/index.json에서 "features" 키를 추가한다.
	jq '.features = { "enableComparisonDateRange": false }' build/index.json > build/index.json.tmp && mv build/index.json.tmp build/index.json

build-dev:
	yarn build:dev
	$(MAKE) build-post

run:
	yarn start

simple-dev:
	cat dscc.min.js src/index.js > build/index.js
	cd build && gsutil cp -a public-read * gs://lookerstudio-community-viz
