# 🛠️ Panam CLI

**Panam CLI** provides a unified command-line interface
for managing projects across multiple package managers,
ensuring a seamless development experience regardless of the runtime environment.

---

## 🚀 Installation

Install Panam CLI globally using your preferred package manager:

- **With `npm`**:
  
  ```bash
  npm install -g panam-cli
  ```

- **With `yarn`**:

  ```bash
  yarn global add panam-cli
  ```

- **With `pnpm`**:

  ```bash
  pnpm add -g panam-cli
  ```

- **With `bun`**:

  ```bash
  bun install -g panam-cli
  ```

- **With `deno`**:

  ```bash
  deno install --allow-scripts npm:panam-cli
  ```

---

## 🧑‍💻 Usage

### Run a Command

Panam CLI automatically detects the active package manager for your project:

```bash
panam install
```

### Execute a Script

Run a script defined in your `package.json`:

```bash
panam run <script-name>
```

### Add or Remove Packages

#### Add a Package

```bash
panam add lodash
```

#### Remove a Package

```bash
panam remove lodash
```

### Use `exec` or `dlx`

#### Execute a Global Tool

```bash
panam exec eslint .
```

#### Use `dlx` for Temporary Tools

```bash
panam dlx create-react-app my-app
```

---

## 🌟 Features

- **Unified commands**: Consistent interface
across `npm`, `pnpm`, `yarn`, `bun`, `deno`, and more.
- **Command flexibility**: Support
for `install`, `add`, `remove`, `run`, `exec`, and `dlx` commands.
- **Automatic detection**: Detects the appropriate package manager for your project.
- **Cross-runtime compatibility**: Works with popular runtimes and environments.

---

## 💡 Examples

### Install Dependencies

```bash
panam install
```

### Add a Development Dependency

```bash
panam add --dev typescript
```

### Run a Build Script

```bash
panam run build
```

### Lint Your Code

```bash
panam exec eslint .
```

---

## 📚 Documentation

Visit the [Panam website](https://siguici.github.io/panam)
for detailed CLI documentation and usage examples.

---

## 🛡️ License

Licensed under the [MIT License](./LICENSE.md).
Created with ❤️ by [Sigui Kessé Emmanuel](https://github.com/siguici).
