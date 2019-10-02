# GitHub Action to install Arduino IDE

## Usage

### Example Workflow file

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - name: Install Arduino IDE
      uses: me-no-dev/arduino-ide-action@master
        with:
          ide_path: $HOME/arduino-ide
          usr_path: $HOME/Arduino

...
    - run: |
        ...
```

## License

The Dockerfile and associated scripts and documentation in this project are released under the [MIT License](LICENSE).
