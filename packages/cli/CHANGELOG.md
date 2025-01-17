# panam-cli

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
