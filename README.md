# Nicolas - The TypeScript Project Wizard 🚀

![Nicolas Logo](https://placekitten.com/200/200)

Nicolas is your friendly neighborhood TypeScript project wizard! 🧙‍♂️ With just a few commands, Nicolas will conjure up a magical TypeScript project for you to test things out.

## Installation

```bash
npm install -g nicolas
```

## Quick Start

To unleash the magic without passing any flags, simply use:

```bash
npx nicolas
```

Nicolas will guide you through a magical journey with prompts:

- 🪄 **Do you wish to include linting?**

  - Answer: Yes/No

- 🪄 **Which package manager do you want to use?**
  - Answer: pnpm/yarn/npm

Example:

```bash
❯ npx nicolas@latest one-more-repo
? Do you wish to include linting? Yes
? Which package manager do you want to use? pnpm
Creating project one-more-repo at ./one-more-repo
✔ Initializing git repository...
✔ Initializing pnpm...
✔ Installing dependencies...
✔ Initializing tsconfig...
✔ Creating src/index.ts...
✔ Creating package.json
✔ Setting up linting...

🎉 Everything is ready! Run cd one-more-repo to start!

```

## Advanced Usage

```bash
nicolas [name] [--with-lint] [--pnpm|--yarn|--npm]
```

### Options

- `[name]`: Name of your project. If not provided, Nicolas will ask for it.
- `--with-lint`: Include linting in your project.
- `--no-lint`: Skip linting (if you're feeling rebellious).
- `--pnpm`: Use pnpm as the package manager.
- `--yarn`: Use yarn as the package manager.
- `--npm`: Use npm as the package manager.

## Examples

```bash
# Create a project named "awesome-ts-app" with linting using pnpm
nicolas awesome-ts-app --with-lint --pnpm

# Create a project named "cool-project" without linting using yarn
nicolas cool-project --no-lint --yarn
```

---

**Note:** Nicolas is not responsible for any unintended magical consequences. Use at your own risk! 🧙‍♂️
