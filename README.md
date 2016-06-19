# react-querybuilder
A QueryBuilder component for React

[![npm](https://img.shields.io/npm/v/react-querybuilder.svg?maxAge=2592000)]()

**Credits**: This component was inspired by prior work from:

- [jQuery QueryBuilder](http://querybuilder.js.org/)
- [Angular QueryBuilder](https://github.com/mfauveau/angular-query-builder)


### Getting Started

![Screenshot](_assets/screenshot.png)

```shell
npm install react-querybuilder --save
```
### Demo

Open `<path-to-project>/node_modules/react-querybuilder/demo/index.html` in your browser.

OR

[See live Demo](http://www.webpackbin.com/41LfnfeBb).


### Usage

```jsx
import {QueryBuilder} from 'react-querybuilder';

const fields = [
    {name: 'firstName', label: 'First Name'},
    {name: 'lastName', label: 'Last Name'},
    {name: 'age', label: 'Age'},
    {name: 'address', label: 'Address'},
    {name: 'phone', label: 'Phone'},
    {name: 'email', label: 'Email'},
    {name: 'twitter', label: 'Twitter'},
    {name: 'isDev', label: 'Is a Developer?', value: false},
];

const dom = <QueryBuilder fields={fields}
                          onQueryChange={logQuery}/>


function logQuery(query) {
    console.log(query);
}

```

