.PHONY: verify demo package release-check
verify:
	npm run lint && npm run typecheck && npm run test:coverage && npm run test:e2e && npm run build
demo:
	npm run demo
package:
	npm run build && npm run package
release-check:
	npm run release-check
