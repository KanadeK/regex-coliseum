# Release checklist

- [ ] Restore GitHub authentication and complete the competitor/name scan.
- [ ] Run `npm ci`, `make verify`, `make demo`, and `make package`.
- [ ] Unpack the web archive in a clean temporary directory and serve it for a smoke check.
- [ ] Commit with the authenticated GitHub identity and verify author/committer.
- [ ] Run `make release-check` from a clean worktree.
- [ ] Create the public repository, push `main`, wait for green CI, then tag `v0.1.0`.
- [ ] Create the non-draft release with every `dist-release/` asset and verify checksums.
