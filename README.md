# 🚀 Panam Monorepo

A universal tool for executing commands across multiple package managers,
independent of runtime or environment. Supporting popular tools
like *npm*, *cnpm*, *pnpm*, *yarn*, *bun*, *deno*, and even *jsr*,
it provides a consistent interface to simplify development workflows
and automate tasks, regardless of the package manager being used.

This monorepo contains two main packages:

1. **[Panam API](./packages/core)**: The core programmatic API
for interacting with package managers.
2. **[Panam CLI](./packages/cli)**: The command-line interface for Panam.

---

## 🚀 Features

- 🌍 **Cross-runtime compatibility**:
Works seamlessly with the most popular package managers
like `npm`, `cnpm`, `pnpm`, `yarn`, `bun`, `deno`, and `jsr`.
- 🎯 **Unified interface**: One tool to handle commands across different managers,
so you can focus on building.
- ⚡ **Performance optimized**: Executes commands efficiently with runtime detection
and intelligent fallback strategies.
- 🔧 **Future-ready**: Easily extendable to support new package managers.
- 🛠️ **Command flexibility**: Support for `install`, `add`, `remove`, `run`, `exec`,
and `dlx` commands with consistent behavior across environments.
- 📂 **Custom detection**: Automatically detects the appropriate package manager
for a given project or allows explicit specification.

---

## 📂 Packages

### 1. **Panam API**

The `panam` package provides a programmatic interface for developers
who want to integrate Panam functionality into their own applications.

- [Read more about Panam API](./packages/core/README.md)

### 2. **Panam CLI**

The `panam-cli` package offers a command-line interface
to execute Panam commands directly in your terminal.

- [Read more about Panam CLI](./packages/cli/README.md)

---

## 🚀 Installation

Install the specific Panam package based on your needs
using your preferred package manager:

### Install Panam API

- **With `NPM`**:

  ```bash
  npm install panam
  ```

- **With `Yarn`**:

  ```bash
  yarn add panam
  ```

- **With `PNPM`**:

  ```bash
  pnpm add panam
  ```

- **With `Bun`**:

  ```bash
  bun add panam
  ```

- **With `Deno`**:

  ```bash
  deno add --allow-scrits npm:panam
  ```

### Install Panam CLI

- **With `NPM`**:

  ```bash
  npm install -g panam
  ```

- **With `Yarn`**:

  ```bash
  yarn global add panam
  ```

- **With `PNPM`**:

  ```bash
  pnpm add -g panam
  ```

- **With `Bun`**:

  ```bash
  bun install -g panam
  ```

- **With `Deno`**:

  ```bash
  deno install --allow-scripts npm:panam
  ```

---

## 🧑‍💻 Usage

### Run a command

Panam automatically detects the active package manager for your project:

```bash
panam install
```

### Execute a script

Run a script defined in your `package.json`:

```bash
panam run <script-name>
```

### Use `exec` or `dlx`

Panam adapts commands like `exec` or `dlx` for compatibility across package managers:

```bash
panam exec vite --template vue
```

---

## 💡 Examples

### Install dependencies

```bash
panam install
```

### Add a package

```bash
panam add lodash
```

### Remove a package

```bash
panam remove lodash
```

### Create a new project

```bash
panam create react-app my-app
```

### Execute a global tool

```bash
panam exec eslint .
```

### Use `dlx` to run a package without installing it globally

```bash
panam dlx create-react-app my-react-app
```

---

## 🛠️ Programmatic API

Panam also exposes a powerful programmatic API for advanced use cases:

```typescript
import pm from 'panam';

const version = await pm.version();
console.log(`Current package manager version: ${version}`);

const help = await pm.help();
console.log(help);

await pm.$('install');

await pm.install();

await pm.create('@qwikdev/astro');

await pm.add('@qwikdev/astro');

await pm.run('create-astro');

await pm.exec('astro add @qwikdev/astro');

await pm.dlx('@qwikdev/create-astro my-qwik-astro-app');

await pm.x('astro add @qwikdev/astro');
```

---

## 📖 Supported Package Managers

Panam currently supports the following package managers:

- ✅ npm
- ✅ cnpm
- ✅ pnpm
- ✅ yarn
- ✅ bun
- ✅ deno
- ✅ jsr

More package managers can be added with ease.

---

## 📚 Documentation

Go to [https://siguici.github.io/panam](https://siguici.github.io/panam)
for more documentation and usage examples.

---

## 🛡️ License

Under the [MIT License](./LICENSE.md).
Created with ❤️ by [Sigui Kessé Emmanuel](https://github.com/siguici).
