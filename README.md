# react-querybuilder

[![npm](https://img.shields.io/npm/v/react-querybuilder.svg?maxAge=2592000)](https://www.npmjs.com/package/react-querybuilder)

## Credits
This component was inspired by prior work from:

- [jQuery QueryBuilder](http://querybuilder.js.org/)
- [Angular QueryBuilder](https://github.com/mfauveau/angular-query-builder)


## Getting Started

![Screenshot](_assets/screenshot.png)

```shell
npm install react-querybuilder --save
```
## Demo

Open `<path-to-project>/node_modules/react-querybuilder/demo/index.html` in your browser.

OR

[See live Demo](http://www.webpackbin.com/41LfnfeBb).


## Usage

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

## API

`<QueryBuilder />` is the only top-level component exposed from this library. It supports the following properties:

#### fields *(Required)*
[ {name:String, label:String} ]

The array of fields that should be used. Each field should be an object with
`{name:String, label:String}` |

#### operators *(Optional)*
[ {name:String, label:String} ]

The array of operators that should be used. The default operators include:

```js
[
    {name: 'null', label: 'Is Null'},
    {name: 'notNull', label: 'Is Not Null'},
    {name: 'in', label: 'In'},
    {name: 'notIn', label: 'Not In'},
    {name: '=', label: '='},
    {name: '!=', label: '!='},
    {name: '<', label: '<'},
    {name: '>', label: '>'},
    {name: '<=', label: '<='},
    {name: '>=', label: '>='},
]
```

#### combinators *(Optional)*
[ {name:String, label:String} ]

The array of combinators that should be used for RuleGroups.
The default set includes:

```js
[
    {name: 'and', label: 'AND'},
    {name: 'or', label: 'OR'},
]
```

#### controls *(Optional)*
```js
React.PropTypes.shape({
  fieldSelector: React.PropTypes.element,
  operatorSelector: React.PropTypes.element,
  valueEditor: React.PropTypes.element
})
```

This is a custom controls object invoked by the internal `<Rule />` component
to determine the components to use.
The following components are supported:
- `fieldSelector`: By default a `<select />` is used. The following props are passed:

  ```js
  {
    className: React.PropTypes.string, //css classNames to be applied
    options: React.PropTypes.array, //same as 'fields' passed into QueryBuilder
    handleOnChange: React.PropTypes.func //callback function to update query representation
  }
  ```
- `operatorSelector`: By default a `<select />` is used. The following props are passed:

  ```js
  {
    className: React.PropTypes.string, //css classNames to be applied
    options: React.PropTypes.array, //return value of getOperators(field)
    handleOnChange: React.PropTypes.func //callback function to update query representation
  }
  ```
- `valueEditor`: By default a `<input type="text" />` is used. The following props are passed:

  ```js
  {
    field: React.PropTypes.string, //field name corresponding to this Rule
    operator: React.PropTypes.string, //operator name corresponding to this Rule
    handleOnChange: React.PropTypes.func //callback function to update the query representation
  }
  ```

#### getOperators *(Optional)*
function(field):[]

This is a callback function invoked to get the list of allowed operators
for the given field

#### onQueryChange *(Optional)*
function(queryJSON):void

This is a notification that is invoked anytime the query configuration changes. The
query is provided as a JSON structure, as shown below:

```json
{
  "combinator": "and",
  "rules": [
    {
      "field": "firstName",
      "operator": "null",
      "value": ""
    },
    {
      "field": "lastName",
      "operator": "null",
      "value": ""
    },
    {
      "combinator": "and",
      "rules": [
        {
          "field": "age",
          "operator": ">",
          "value": "30"
        }
      ]
    }
  ]
}
```

#### controlClassnames *(Optional)*
This can be used to assign specific `CSS` classes to various controls
that are created by the `<QueryBuilder />`. This is an object
with the following properties:

```js
{
    queryBuilder:String, // Root <div> element

    ruleGroup:String, // <div> containing the RuleGroup
    combinators:String, // <select> control for combinators
    addRule:String, // <button> to add a Rule
    addGroup:String, // <button> to add a RuleGroup
    removeGroup:String, // <button> to remove a RuleGroup

    rule:String, // <div> containing the Rule
    fields:String, // <select> control for fields
    operators:String, // <select> control for operators
    value:String, // <input> for the field value
    removeRule:String // <button> to remove a Rule

}
```
