# Pragma Web Utils

## Before start working

Install root dependencies
```
yarn
```
Bootstrap packages
```
yarn run bootstrap
```

## Build

For build all packages
```
yarn run build
```
For build one package
```
cd packages/<<packageName>> && yarn run build
```

## Start

For start all packages
```
yarn run start
```
For start one package
```
cd packages/<<packageName>> && yarn run start
```

## Run test

For run test of all packages
```
yarn run test
```
For run test of one package
```
cd packages/<<packageName>> && yarn run test
```

## Publish packages

For safely publish all changed packages:
- checkout to `releases` brunch and merge needed changes to this brunch
- login to your npm account (make sure that your account has access to publish)
```
npm login
```
- run publish script
```
yarn run publish
```
(make sure that you don't run ``yarn publish``, last one publish root as lib, but not trigger lerna publish scenario)
