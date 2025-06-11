# panam-cli

## 0.2.0

### Minor Changes

- 22b6380: Adds new commands & features, improves UX, updates dependencies, and enhances robustness.

  ### 🚀 Release Notes

  **What's New & Improved**

  - ✨ **New Features**

    - Add `which` command to locate executables.
    - Allow user to add custom tools.
    - Add support for initializing a new project with a chosen package manager.
    - Add more Git commands.
    - Add `Git` module.

  - 🧑‍💻 **Enhancements & User Experience**

    - Rename `Runner` to `Tool`.
    - Export `Git` and `Runner` modules.
    - Add install command alias.
    - Rename the `add` alias to `a`.
    - Check if the tool is installed before running any command.
    - Improve the `use()` method’s usage.
    - Fix aliasing when using `use()`.
    - Make tool typing extensible.
    - Improve type definitions.

  - 🚚 **Refactoring**

    - Rename `process` to `executor`.

  - ⚡️ **Performance & Robustness**

    - Use `tsx` instead of `tsm` for better performance.
    - Exit immediately on errors (`Exit on error`).

  - 🥅 **Dependency & Action Updates**

    - Update dependencies.
    - Update GitHub Actions.

### Patch Changes

- Updated dependencies [22b6380]
  - panam@0.3.0

## 0.1.2

### Patch Changes

- c1b6104: 🚑️ Fix new project initialization command
- Updated dependencies [c1b6104]
  - panam@0.2.2

## 0.1.1

### Patch Changes

- b51fc95: ✨ Add new project initialization command
- Updated dependencies [b51fc95]
  - panam@0.2.1

## 0.1.0

### Minor Changes

- 7266b96: We’re excited to announce a minor update packed with significant improvements
  and enhanced features to deliver an even smoother and more powerful experience!
  Here’s what’s new:

  #### 🚀 General Improvements

  - **Enhanced API with runtime execution support**:
    The API has been optimized to better handle execution across various runtimes,
    providing more flexibility and robustness.
  - **CLI/API alignment**:
    CLI commands now closely mirror the exported API methods,
    ensuring consistent usage and seamless integration.

  #### ✨ New Features

  - **Addition of JSR and other missing commands**:
    The CLI has been enriched with previously missing commands,
    such as JSR, to cover more use cases effectively.
  - **Improved validation and result handling**:
    Stricter validation and better result management
    ensure more reliable processes and clearer feedback.

  #### 🛠️ Fixes and Optimizations

  - **Fixed argument parsing for subprocesses**:
    More precise handling of subprocess arguments,
    reducing errors and improving compatibility.
  - **And much more!** 🎉

  We invite you to explore this new version
  and experience the numerous enhancements firsthand.

  ***

  **Thank you for your continued support!**
  💡 If you encounter any issues or have suggestions,
  feel free to reach out via [https://github.com/siguici/panam.issues](https://github.com/siguici/panam/issues).

### Patch Changes

- Updated dependencies [7266b96]
  - panam@0.2.0

## 0.0.2

### Patch Changes

- 4cbe404: Rename the CLI and give it an alias (`pnm`)

## 0.0.1

### Patch Changes

- 5cf7788: We have restructured the Panam project into a **workspace**
  to improve scalability and maintainability.
  This update introduces significant changes and new features.

  ### 🔔 Key Changes

  - **Separation into Core API and CLI:**

    Panam has been split into two distinct packages:

    - `panam`: The core API for handling commands
      and providing runtime-agnostic functionalities.

    - `panam-cli`: A user-friendly command-line interface
      built on top of the core API.

  - **Introduction of `panam-cli`:**

    A brand-new CLI package providing a consistent and streamlined interface
    for executing package manager commands.

  - **Documentation Updates:**

    The documentation has been updated to reflect the new workspace structure
    and explain the usage of both `panam` and `panam-cli`.

  ### 🛠️ Details of the Changes

  - **Core API Enhancements**

    - Refactored the core to enable better reusability and modularity.
    - Improved runtime detection and command execution logic.

  - **CLI Implementation:**

    - Added command support for `install`, `add`, `remove`, `run`, `exec`, and `dlx`.
    - Enhanced output clarity and error handling for CLI users.

  - **Updated Documentation:**
    - Added instructions for installing and using `panam-cli`.
    - Enhanced examples to showcase both programmatic and CLI usage.

  ### 📦 Installation Instructions

  - For the Core API:

    ```bash
    npm install panam
    ```

  - For the CLI:

  ```bash
  npm install -g panam-cli
  ```

- Updated dependencies [5cf7788]
  - panam@0.1.1
