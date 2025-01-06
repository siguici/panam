.PHONY: install build check fix test release pr-release

install: node_modules pnpm-lock.yaml

node_modules: package.json
	pnpm i --frozen-lockfile

pnpm-lock.yaml: package.json
	pnpm up
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
	pnpx pkg-pr-new publish

release: test
	pnpm release
