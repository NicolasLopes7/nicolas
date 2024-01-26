# Nicolas - The TypeScript Project Wizard 🚀

![image](https://github.com/NicolasLopes7/nicolas/assets/57234795/dc62a117-bc1a-427b-b8b3-4bf2f1c1974f)

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

<img width="522" alt="Screenshot 2024-01-26 at 13 19 32" src="https://github.com/NicolasLopes7/nicolas/assets/57234795/ca4cbc66-3b00-4519-89b0-94f7d5344ae8">


## Advanced Usage

```bash
nicolas [name] [--with-lint] [--pnpm|--yarn|--npm] [--remove]
```

### Options

- `[name]`: Name of your project. If not provided, Nicolas will ask for it.
- `--with-lint`: Include linting in your project.
- `--no-lint`: Skip linting (if you're feeling rebellious).
- `--pnpm`: Use pnpm as the package manager.
- `--yarn`: Use yarn as the package manager.
- `--npm`: Use npm as the package manager.
- `--remove`: Remove the project folder after the script finishes (for developers in a hurry).

## Examples

```bash
# Create a project named "awesome-ts-app" with linting using pnpm
nicolas awesome-ts-app --with-lint --pnpm

# Create a project named "cool-project" without linting using yarn
nicolas cool-project --no-lint --yarn

# Create a project named "quick-test" and remove the folder after finishing
nicolas quick-test --remove
```

---

**Note:** Nicolas is not responsible for any unintended magical consequences. Use at your own risk! 🧙‍♂️
