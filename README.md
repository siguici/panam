# PanPM

A universal tool for executing commands across multiple package managers,
independent of runtime or environment. Supporting popular tools
like npm, cnpm, pnpm, yarn, bun, and deno, it provides a consistent interface
to simplify development workflows and automate tasks,
regardless of the package manager being used.

---

## 🚀 Features

- 🌍 **Cross-runtime compatibility**:
Works seamlessly with the most popular package managers
like `npm`, `cnpm`, `pnpm`, `yarn`, `bun`, and `deno`.
- 🎯 **Unified interface**: One tool to handle commands across different managers,
so you can focus on building.
- ⚡ **Performance optimized**: Executes commands efficiently with runtime detection
and intelligent fallback strategies.
- 🔧 **Future-ready**: Easily extendable to support new package managers.

---

## 📦 Installation

Install PanPM globally using your preferred package manager:

- **With `NPM`**:

  ```bash
  npm install panpm
  ```

- **With `Yarn`**:

  ```bash
  yarn install panpm
  ```

- **With `PNPM`**:

  ```bash
  pnpm install panpm
  ```

- **With `Bun`**:

  ```bash
  bun install panpm
  ```

- **With `Deno`**:

  ```bash
  deno install npm:panpm
  ```

### 🧑‍💻 Usage

#### Run a command

PanPM automatically detects the active package manager for your project:

```bash
panpm install
```

#### Execute a script

Run a script defined in your package.json:

```bash
panpm run <script-name>
```

#### Use `exec` or `dlx`

PanPM adapts commands like exec or dlx for compatibility across package managers:

```bash
panpm exec vite --template vue
```

### 💡 Examples

Yes

### 🛠️ Programmatic API

PanPM also exposes a powerful programmatic API for advanced use cases:

```typescript
import pm from 'panpm';

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

## 📖 Supported Package Managers

PanPM currently supports the following package managers:

- ✅ npm
- ✅ cnpm
- ✅ pnpm
- ✅ yarn
- ✅ bun
- ✅ deno

More package managers can be added with ease.

## 📚 Documentation

Go to [https://panpm.js.org](https://panpm.js.org) for more documentation and usage examples.

## 🛡️ License

Under the [MIT License](./LICENSE.md).
Created with ❤️ by [Sigui Kessé Emmanuel](https://github.com/siguici).
