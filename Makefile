.PHONY: install build check fix test release pr-release

install: node_modules pnpm-lock.yaml

node_modules: package.json packages/core/package.json packages/cli/package.json
	pnpm i -r --frozen-lockfile

pnpm-lock.yaml: package.json packages/core/package.json packages/cli/package.json
	pnpm up -r
	pnpm fix

fix: install
	pnpm fix

build: fix
	pnpm build

check: install
	pnpm check

test: build check
	pnpm test

pr-release: test
	pnpx pkg-pr-new publish ./packages/*

release: test
	pnpm release
