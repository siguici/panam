---
"panam-cli": minor
"panam": minor
---

Adds new commands & features, improves UX, updates dependencies, and enhances robustness.

### 🚀 Release Notes

**What's New & Improved**

* ✨ **New Features**

  * Add `which` command to locate executables.
  * Allow user to add custom tools.
  * Add support for initializing a new project with a chosen package manager.
  * Add more Git commands.
  * Add `Git` module.

* 🧑‍💻 **Enhancements & User Experience**

  * Rename `Runner` to `Tool`.
  * Export `Git` and `Runner` modules.
  * Add install command alias.
  * Rename the `add` alias to `a`.
  * Check if the tool is installed before running any command.
  * Improve the `use()` method’s usage.
  * Fix aliasing when using `use()`.
  * Make tool typing extensible.
  * Improve type definitions.

* 🚚 **Refactoring**

  * Rename `process` to `executor`.

* ⚡️ **Performance & Robustness**

  * Use `tsx` instead of `tsm` for better performance.
  * Exit immediately on errors (`Exit on error`).

* 🥅 **Dependency & Action Updates**

  * Update dependencies.
  * Update GitHub Actions.
