# mesa3d-setup
A composite runs step action which builds and sets up mesa3d on the VM for your workflow. Useful for testing graphics applications during CI with GitHub actions.

This action also does the following:
* Installs Vulkan libraries
* Starts an X11 server on linux

## Warning
Use this at your own risk

## Requirements
(Windows) Until an action can be included in other actions the following action must be present before running this action on windows:
```
- uses: actions/setup-python@v1
  with:
    python-version: 3.7
```

## Build instructions
```
$ npm install
$ npx tsc
```

## To do
* Add cross platform support (this action is currently only tested on ubuntu linux).
* Implement caching to decrease runtime