# 🎉 Panam Core API

**Panam Core API** provides a programmatic way to interact with package managers
through a unified and efficient interface. Designed for flexibility and extensibility,
the Core API eliminates the need to manually adapt to various package manager commands,
enabling seamless development workflows.

---

## 🚀 Installation

Install the Core API as a standalone package:

- **With `npm`**:
  
  ```bash
  npm install panam
  ```

- **With `yarn`**:

  ```bash
  yarn add panam
  ```

- **With `pnpm`**:

  ```bash
  pnpm add panam
  ```

---

## 🛠️ Usage

### Importing the API

Start by importing Panam Core API into your project:

```typescript
import pm from 'panam';
```

### Run Commands

Use the unified API to execute commands across various package managers:

#### Install dependencies

```typescript
await pm.install();
```

#### Add a package

```typescript
await pm.add('lodash');
```

#### Remove a package

```typescript
await pm.remove('lodash');
```

#### Run a script

```typescript
await pm.run('build');
```

#### Execute a tool

```typescript
await pm.exec('eslint .');
```

#### Use `dlx` to execute temporary tools

```typescript
await pm.dlx('create-react-app my-app');
```

---

## 📖 API Reference

### Methods

- **`install()`**:
  Installs all dependencies in the current project.

- **`add(...packages: string[])`**:
  Adds specified packages to the project.

- **`remove(...packages: string[])`**:
  Removes specified packages from the project.

- **`run(script: string)`**:
  Runs a script defined in the project's `package.json`.

- **`exec(command: string)`**:
  Executes a specific command using the detected package manager.

- **`dlx(command: string)`**:
  Runs a package as a one-time executable.

---

## 🌟 Features

- **Cross-runtime compatibility**: Unified API
for `npm`, `pnpm`, `yarn`, `bun`, `deno`, and more.
- **Simplified workflows**: Consistent commands across package managers.
- **Extensibility**: Easily extendable to support new tools and managers.

---

## 📚 Documentation

For detailed documentation, visit the [Panam website](https://siguici.github.io/panam).

---

## 🛡️ License

Licensed under the [MIT License](./LICENSE.md).
Created with ❤️ by [Sigui Kessé Emmanuel](https://github.com/siguici).
