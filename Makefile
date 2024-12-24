.PHONY: clean install build-dev build-prod run yalc simple-dev build-post

# 기본 설정
NODE_VERSION=23.4.0
YARN_VERSION=1.22.22
NPM_VERSION=10.9.2

# 버킷 설정 
DEV_BUCKET=gs://lookerstudio-community-viz
PROD_BUCKET=gs://lookerstudio-community-viz-prod

check-versions:
	@echo "Checking versions..."
	@node -v | grep -q "v$(NODE_VERSION)" || (echo "Wrong node version. Expected v$(NODE_VERSION)"; exit 1)
	@yarn -v | grep -q "$(YARN_VERSION)" || (echo "Wrong yarn version. Expected $(YARN_VERSION)"; exit 1)
	@npm -v | grep -q "$(NPM_VERSION)" || (echo "Wrong npm version. Expected $(NPM_VERSION)"; exit 1)

clean:
	rm -rf node_modules
	rm -rf build

yalc-publish:
	cd tooling/packages/dscc-scripts && yalc publish
	cd tooling/packages/dscc-validation && yalc publish
	cd tooling/packages/dscc-gen && yalc publish
	cd handlebars-helpers && yalc publish
	yalc add @google/dscc-scripts \
		@google/dscc-validation \
		@google/dscc-gen \
		@fantajeon/handlebars-helpers

yalc-update:
	cd tooling/packages/dscc-scripts && yalc push
	cd tooling/packages/dscc-validation && yalc push
	cd tooling/packages/dscc-gen && yalc push
	cd handlebars-helpers && yalc push
	yalc update

install: check-versions yalc-publish
	yarn install

build-post:
	jq '.features = { "enableComparisonDateRange": false }' build/index.json > build/index.json.tmp && mv build/index.json.tmp build/index.json
	jq '(.style[] | select(.elements[]? | select(.type == "CHECKBOX" and .defaultValue == "false")).elements[] | select(.type == "CHECKBOX" and .defaultValue == "false")).defaultValue = false' build/index.json > build/index.json.tmp && mv build/index.json.tmp build/index.json

build-dev:
	mkdir -p dist
	NODE_ENV=development yarn build:dev
	$(MAKE) build-post
	gsutil cp -a public-read build/* $(DEV_BUCKET)

build-prod:
	NODE_ENV=production yarn build:prod
	$(MAKE) build-post
	gsutil cp -a public-read build/* $(PROD_BUCKET)

run:
	yarn start

simple-dev:
	cat dscc.min.js src/index.js > build/index.js
	cd build && gsutil cp -a public-read * $(DEV_BUCKET)

init:
	@echo "Initializing development environment..."
	$(MAKE) clean
	$(MAKE) install
	$(MAKE) build-dev
