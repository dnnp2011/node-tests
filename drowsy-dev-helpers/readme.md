## Description
A collection of Javascript prototypes, helper functions, utilities, and other general purpose tools useful for a variety of projects. Created as a personal collection of useful things for DrowsyDev projects.

## Installation
Add the NPM package to your project by running:
> ```npm install drowsy-dev-helpers```

Or install globally with
> ```npm install -g drowsy-dev-helpers```

## Usage
Simply require the package. There is no need to bind the result to a variable, as the module exports a self-invoking function that initializes the sub-modules.
> ```require('drowsy-dev-helpers');```

To avoid unnecessary overhead, you may also import individual modules of the collection using the following syntax:
> ```require('drowsy-dev-helpers').numbers```

## Modules
To allow for modularity and overhead reduction, you can require individual modules of the larger package to get just the pieces that are useful for your particular file or project. A comprehensive list of these modules are listed below:
> * ```require('drowsy-dev-helpers').numbers``` -- Prototypes that can be used on numbers
> * ```require('drowsy-dev-helpers').helpers``` -- General purposes helper functions

## Author
>**DrowsyDev**