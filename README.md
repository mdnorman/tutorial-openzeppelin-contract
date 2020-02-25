# Tutorial OpenZeppelin Contract

## Setup

### Node

1.  Install `nvm` ([Node Version Manager])
2.  `cd` to the project directory and execute the following:
    ```
    nvm install
    nvm use
    npm install
    ```

### IDE Setup

This project uses [EditorConfig] for IDE configuration.

See `.editorconfig` for settings.

Many popular IDEs and editors support this out of the box or with a plugin.

## Development

### Prettier

This project uses [Prettier], so please run it before checking in:

```
npm run pretty
```

See `.prettierrc` for settings.

Some IDEs and editors have plugins for running Prettier.

### Linting

This project uses [TSLint]. Check linting before checking in:

```
npm run lint
```

See `tslint.json` for settings.

Many IDEs and editors support TSLint.

## Testing

This project uses [Jasmine] for testing. Run tests before checking in.

### Unit Tests

```
npm test
```

### Integration Tests

```
npm run test:integration
```

## Building

```
npm run build
```

## Contracts

### Build and deploy

```shell script
npx oz create
```

[editorconfig]: https://editorconfig.org/
[jasmine]: https://jasmine.github.io/
[node version manager]: https://github.com/creationix/nvm
[prettier]: https://prettier.io/
[tslint]: https://palantir.github.io/tslint/
