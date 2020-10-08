# react-querybuilder
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-20-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
[![npm](https://img.shields.io/npm/v/react-querybuilder.svg?maxAge=2592000)](https://www.npmjs.com/package/react-querybuilder)
[![Build Status](https://travis-ci.org/sapientglobalmarkets/react-querybuilder.svg?branch=master)](https://travis-ci.org/sapientglobalmarkets/react-querybuilder)
[![codecov.io](https://codecov.io/github/sapientglobalmarkets/react-querybuilder/coverage.svg?branch=master)](https://codecov.io/github/sapientglobalmarkets/react-querybuilder?branch=master)

- [Getting Started](#getting-started)
- [Demo](#demo)
- [Usage](#usage)
- [API](#api)
  - [QueryBuilder](#querybuilder)
  - [formatQuery](#formatquery)
- [IE11 Support](#ie11-support)
- [Development](#development)
  - [Changelog Generation](#changelog-generation)
- [Credits](#credits)
- [Contributors](#contributors-)

![Screenshot](_assets/screenshot.png)

## Getting Started

```shell
npm install react-querybuilder --save
```

OR

```shell
yarn add react-querybuilder
```

## Demo

[See live demo](https://sapientglobalmarkets.github.io/react-querybuilder/)

OR

To run the demo yourself, go through the following steps:

1. `npm install` _Install npm packages_
2. `npm start` _Run a local server_
3. http://localhost:8080/ _Visit your localhost in your browser_

## Usage

```jsx
import QueryBuilder from 'react-querybuilder';

const fields = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
  { name: 'age', label: 'Age' },
  { name: 'address', label: 'Address' },
  { name: 'phone', label: 'Phone' },
  { name: 'email', label: 'Email' },
  { name: 'twitter', label: 'Twitter' },
  { name: 'isDev', label: 'Is a Developer?', defaultValue: false }
];

const dom = <QueryBuilder fields={fields} onQueryChange={logQuery} />;

function logQuery(query) {
  console.log(query);
}
```

## API

The default export of this library is the [`<QueryBuilder />`](#QueryBuilder) React component.  Named exports include the `<Rule />` component (for use in custom `<RuleGroup />` implementations) and a utility function, [`formatQuery`](#formatQuery).

### QueryBuilder

`<QueryBuilder />` supports the following properties:

#### `query` _(Optional)_

`{id?: string, combinator: string, rules: ({field: string, value: any, operator: string} | {rules: ...[], combinator: string})[]}`

The initial query, in JSON form (follows the same format as the parameter passed to the [`onQueryChange`](#onquerychange-optional) callback). `id` is optional. See [the demo source](demo/main.js) for examples.

#### `fields` _(Required)_

The array of fields that should be used. Each field should be an object with the following signature:

```ts
interface Field {
  id?: string; // The field identifier (if not provided, then `name` will be used)
  name: string; // REQUIRED - the field name
  label: string; // REQUIRED - the field label
  operators?: { name: string; label: string; }[]; // Array of operators (if not provided, then `getOperators()` will be used)
  valueEditorType?: 'text' | 'select' | 'checkbox' | 'radio' | null; // Value editor type for this field (if not provided, then `getValueEditorType()` will be used)
  inputType?: string | null; // Input type for text box inputs, e.g. 'text', 'number', or 'date' (if not provided, then `getInputType()` will be used)
  values?: { name: string; label: string; }[]; // Array of values, applicable when valueEditorType is 'select' or 'radio' (if not provided, then `getValues()` will be used)
  defaultValue?: any; // Default value for this field (if not provided, then `getDefaultValue()` will be used)
}
```

Field objects can also contain other data. Each field object will be passed to the appropriate `OperatorSelector` and `ValueEditor` components as `fieldData` (see the section on [`controlElements`](#controlelements-optional)).

#### `operators` _(Optional)_

`{name: string, label: string}[]`

The array of operators that should be used. The default operators include:

```js
[
  { name: '=', label: '=' },
  { name: '!=', label: '!=' },
  { name: '<', label: '<' },
  { name: '>', label: '>' },
  { name: '<=', label: '<=' },
  { name: '>=', label: '>=' },
  { name: 'contains', label: 'contains' },
  { name: 'beginsWith', label: 'begins with' },
  { name: 'endsWith', label: 'ends with' },
  { name: 'doesNotContain', label: 'does not contain' },
  { name: 'doesNotBeginWith', label: 'does not begin with' },
  { name: 'doesNotEndWith', label: 'does not end with' },
  { name: 'null', label: 'is null' },
  { name: 'notNull', label: 'is not null' },
  { name: 'in', label: 'in' },
  { name: 'notIn', label: 'not in' }
];
```

#### `combinators` _(Optional)_

`{name: string, label: string}[]`

The array of combinators that should be used for RuleGroups. The default set includes:

```js
[
  { name: 'and', label: 'AND' },
  { name: 'or', label: 'OR' }
];
```

#### `controlElements` _(Optional)_

```js
PropTypes.shape({
  addGroupAction: PropTypes.func, // returns ReactClass
  removeGroupAction: PropTypes.func, // returns ReactClass
  addRuleAction: PropTypes.func, // returns ReactClass
  removeRuleAction: PropTypes.func, // returns ReactClass
  combinatorSelector: PropTypes.func, // returns ReactClass
  fieldSelector: PropTypes.func, // returns ReactClass
  operatorSelector: PropTypes.func, // returns ReactClass
  valueEditor: PropTypes.func, // returns ReactClass
  notToggle: PropTypes.func, // returns ReactClass
  ruleGroup: PropTypes.func, // returns ReactClass
  rule: PropTypes.func // returns ReactClass
});
```

This is a custom controls object that allows you to override the control elements used. The following control overrides are supported:

- `addGroupAction`: By default a `<button />` is used. The following props are passed:

```js
{
  label: PropTypes.string, // "+Group"
  className: PropTypes.string, // CSS classNames to be applied
  handleOnClick: PropTypes.func, // Callback function to invoke adding a <RuleGroup />
  rules: PropTypes.array, // Provides the number of rules already present for this group,
  level: PropTypes.number // The level of the current group
}
```

- `removeGroupAction`: By default a `<button />` is used. The following props are passed:

```js
{
  label: PropTypes.string, // "x"
  className: PropTypes.string, // CSS classNames to be applied
  handleOnClick: PropTypes.func, // Callback function to invoke removing a <RuleGroup />
  rules: PropTypes.array, // Provides the number of rules already present for this group,
  level: PropTypes.number // The level of the current group
}
```

- `addRuleAction`: By default a `<button />` is used. The following props are passed:

```js
{
  label: PropTypes.string, // "+Rule"
  className: PropTypes.string, // CSS classNames to be applied
  handleOnClick: PropTypes.func, // Callback function to invoke adding a <Rule />
  rules: PropTypes.array, // Provides the number of rules already present for this group,
  level: PropTypes.number // The level of the current group
}
```

- `removeRuleAction`: By default a `<button />` is used. The following props are passed:

```js
{
  label: PropTypes.string, // "x"
  className: PropTypes.string, // CSS classNames to be applied
  handleOnClick: PropTypes.func, // Callback function to invoke removing a <Rule />
  level: PropTypes.number // The level of the current group
}
```

- `combinatorSelector`: By default a `<select />` is used. The following props are passed:

```js
{
  options: PropTypes.array.isRequired, // Same as 'combinators' passed into QueryBuilder
  value: PropTypes.string, // Selected combinator from the existing query representation, if any
  className: PropTypes.string, // CSS classNames to be applied
  handleOnChange: PropTypes.func, // Callback function to update query representation
  rules: PropTypes.array, // Provides the number of rules already present for this group
  level: PropTypes.number // The level of the current group
}
```

- `fieldSelector`: By default a `<select />` is used. The following props are passed:

```js
{
  options: PropTypes.array.isRequired, // Same as 'fields' passed into QueryBuilder
  value: PropTypes.string, // Selected field from the existing query representation, if any
  operator: PropTypes.string, // Selected operator from the existing query representation, if any
  className: PropTypes.string, // CSS classNames to be applied
  handleOnChange: PropTypes.func, // Callback function to update query representation
  level: PropTypes.number // The level the group this rule belongs to
}
```

- `operatorSelector`: By default a `<select />` is used. The following props are passed:

```js
{
  field: PropTypes.string, // Field name corresponding to this Rule
  fieldData: PropTypes.object, // The entire object from the fields array for this field
  options: PropTypes.array.isRequired, // Return value of getOperators(field)
  value: PropTypes.string, // Selected operator from the existing query representation, if any
  className: PropTypes.string, // CSS classNames to be applied
  handleOnChange: PropTypes.func, // Callback function to update query representation
  level: PropTypes.number // The level the group this rule belongs to
}
```

- `valueEditor`: By default an `<input type="text" />` is used. The following props are passed:

```js
{
  field: PropTypes.string, // Field name corresponding to this Rule
  fieldData: PropTypes.object, // The entire object from the fields array for this field
  operator: PropTypes.string, // Operator name corresponding to this Rule
  value: PropTypes.string, // Value from the existing query representation, if any
  handleOnChange: PropTypes.func, // Callback function to update the query representation
  type: PropTypes.oneOf(['text', 'select', 'checkbox', 'radio']), // Type of editor to be displayed
  inputType: PropTypes.string, // Type of <input> if `type` is "text"
  values: PropTypes.arrayOf(PropTypes.object), //
  level: PropTypes.number, // The level the group this rule belongs to
  className: PropTypes.string, // CSS classNames to be applied
}
```

- `notToggle`: By default, `<label><input type="checkbox" />Not</label>` is used. The following props are passed:

```js
{
  checked: PropTypes.bool, // Whether the input should be checked or not
  handleOnChange: PropTypes.func, // Callback function to update the query representation
  title: PropTypes.string, // Tooltip for the label
  level: PropTypes.number, // The level of the group
  className: PropTypes.string, // CSS classNames to be applied
}
```

- `ruleGroup`: By default, `<RuleGroup />` is used. The following props are passed:

```js
{
  id: PropTypes.string,
  parentId: PropTypes.string,
  combinator: PropTypes.string,
  rules: PropTypes.array,
  translations: PropTypes.object,
  schema: PropTypes.object,
  not: PropTypes.boolean
}
```

- `rule`: By default, `<Rule />` is used. The following props are passed:

```js
{
  id: PropTypes.string,
  parentId: PropTypes.string,
  field: PropTypes.string,
  value: PropTypes.any,
  operator: PropTypes.string,
  translations: PropTypes.object,
  schema: PropTypes.object
}
```

#### `getOperators` _(Optional)_

`(field: string) => { name: string; label: string; }[] | null`

This is a callback function invoked to get the list of allowed operators for the given field.  If `null` is returned, the default operators are used.

#### `getValueEditorType` _(Optional)_

`(field: string, operator: string) => 'text' | 'select' | 'checkbox' | 'radio' | null`

This is a callback function invoked to get the type of `ValueEditor` for the given field and operator. Allowed values are `"text"` (the default if the function is not provided or if `null` is returned), `"select"`, `"checkbox"`, and `"radio"`.

#### `getInputType` _(Optional)_

`(field: string, operator: string) => string`

This is a callback function invoked to get the `type` of `<input />` for the given field and operator (only applicable when `getValueEditorType` returns `"text"` or a falsy value). If no function is provided, `"text"` is used as the default.

#### `getValues` _(Optional)_

`(field: string, operator: string) => { name: string; label: string; }[]`

This is a callback function invoked to get the list of allowed values for the given field and operator (only applicable when `getValueEditorType` returns `"select"` or `"radio"`). If no function is provided, an empty array is used as the default.

#### `getDefaultField` _(Optional)_

`string | ((fieldsData: Field[]) => string)`

The default field for new rules.  This can be a string identifying the default field, or a function that returns a field name.

#### `getDefaultValue` _(Optional)_

`(rule: Rule) => any`

This function returns the default value for new rules.

#### `onQueryChange` _(Optional)_

`(queryJSON: RuleGroup) => void`

This is a notification that is invoked anytime the query configuration changes. The query is provided as a JSON structure, as shown below:

```json
{
  "combinator": "and",
  "not": false,
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

#### `controlClassnames` _(Optional)_

This can be used to assign specific `CSS` classes to various controls that are created by the `<QueryBuilder />`. This is an object with the following properties:

```js
{
  queryBuilder: string, // Root <div> element
  ruleGroup: string, // <div> containing the RuleGroup
  header: string, // <div> containing the RuleGroup header controls
  combinators: string, // <select> control for combinators
  addRule: string, // <button> to add a Rule
  addGroup: string, // <button> to add a RuleGroup
  removeGroup: string, // <button> to remove a RuleGroup
  notToggle: string, // <label> on the "not" toggle
  rule: string, // <div> containing the Rule
  fields: string, // <select> control for fields
  operators: string, // <select> control for operators
  value: string, // <input> for the field value
  removeRule: string // <button> to remove a Rule
}
```

#### `translations` _(Optional)_

This can be used to override translatable texts applied to various controls that are created by the `<QueryBuilder />`. This is an object with the following properties:

```js
{
  fields: {
    title: "Fields",
  },
  operators: {
    title: "Operators",
  },
  value: {
    title: "Value",
  },
  removeRule: {
    label: "x",
    title: "Remove rule",
  },
  removeGroup: {
    label: "x",
    title: "Remove group",
  },
  addRule: {
    label: "+Rule",
    title: "Add rule",
  },
  addGroup: {
    label: "+Group",
    title: "Add group",
  },
  combinators: {
    title: "Combinators",
  },
  notToggle: {
    title: "Invert this group",
  }
}
```

#### `showCombinatorsBetweenRules` _(Optional)_

`boolean`

Pass `true` to show the combinators (and/or) between rules and rule groups instead of at the top of rule groups. This can make some queries easier to understand as it encourages a more natural style of reading.

#### `showNotToggle` _(Optional)_

`boolean`

Pass `true` to show the "Not" toggle switch for each rule group.

#### `resetOnFieldChange` _(Optional)_

`boolean`

Pass `false` not to reset operator and value for field change.

#### `resetOnOperatorChange` _(Optional)_

`boolean`

Pass `true` to reset value on operator change.

### formatQuery

`formatQuery` formats a given query in either SQL, parameterized SQL, JSON, or JSON without IDs (which can be useful if you need to serialize the rules). Example:

```js
import { formatQuery } from 'react-querybuilder';

const query = {
  id: 'g-b6SQ6WCcup8e37xhydwHE',
  rules: [
    {
      id: 'r-zITQOjVEWlsU1fncraSNn',
      field: 'firstName',
      value: 'Steve',
      operator: '='
    },
    {
      id: 'r-zVx7ARNak3TCZNFHkwMG2',
      field: 'lastName',
      value: 'Vai',
      operator: '='
    }
  ],
  combinator: 'and',
  not: false
};

console.log(formatQuery(query, 'sql')); // '(firstName = "Steve" and lastName = "Vai")'
console.log(formatQuery(query, 'parameterized')); // { sql: "(firstName = ? and lastName = ?)", params: ["Steve", "Vai"] }
```

An `options` object can be passed as the second argument instead of a format string in order to have more detailed control over the output.  The options object takes the following form:

```ts
interface FormatQueryOptions {
  format?: 'sql' | 'json' | 'json_without_ids' | 'parameterized'; // same as passing a `format` string instead of an options object
  valueProcessor?: (field: string, operator: string, value: any) => string; // see below for an example
  quoteFieldNamesWith?: string; // e.g. "`" to quote field names with backticks (useful if your field names have spaces)
}
```

For example, if you need to control the way the value portion of the output is processed, you can specify a custom `valueProcessor` (only applicable for `format: "sql"`).

```js
const query = {
  id: 'g-J5GsbcFmZ6xOJCLPPKIfE',
  rules: [
    {
      id: 'r-KneYcwIPPHDGSogtKhG4g',
      field: 'instrument',
      value: ['Guitar', 'Vocals'],
      operator: 'in'
    },
    {
      id: 'r-wz6AkZbzSyDYbPk1AxgvO',
      field: 'lastName',
      value: 'Vai',
      operator: '='
    }
  ],
  combinator: 'and',
  not: false
};

const valueProcessor = (field, operator, value) => {
  if (operator === 'in') {
    // Assuming `value` is an array, such as from a multi-select
    return `(${value.map((v) => `"${v.trim()}"`).join(',')})`;
  } else {
    return `"${value}"`;
  }
};

console.log(formatQuery(query, { format: 'sql', valueProcessor })); // '(instrument in ("Guitar","Vocals") and lastName = "Vai")'
```

The 'json_without_ids' format will return the same query without the IDs.  This can be useful, for example, if you need to save the query to the URL so that it becomes bookmarkable:

```js
const query = {
  id: 'g-J5GsbcFmZ6xOJCLPPKIfE',
  rules: [
    {
      id: 'r-KneYcwIPPHDGSogtKhG4g',
      field: 'instrument',
      value: ['Guitar', 'Vocals'],
      operator: 'in'
    },
    {
      id: 'r-wz6AkZbzSyDYbPk1AxgvO',
      field: 'lastName',
      value: 'Vai',
      operator: '='
    }
  ],
  combinator: 'and',
  not: false
};

console.log(formatQuery(query, 'json_without_ids'));
// {
//   rules: [
//     {
//       field: 'instrument',
//       value: ['Guitar', 'Vocals'],
//       operator: 'in'
//     },
//     {
//       field: 'lastName',
//       value: 'Vai',
//       operator: '='
//     }
//   ],
//   combinator: 'and',
//   not: false
// };
```

## IE11 Support

In order to use this library with IE11, you must copy the Microsoft-prefixed `crypto` implementation to `window.crypto`:

```js
if (!window.crypto) {
  window.crypto = window.msCrypto
}
```

This requirement is due to the inclusion of the [`nanoid`](https://github.com/ai/nanoid#ie) library.

## Development

### Changelog Generation

We are using [github-changes](https://github.com/lalitkapoor/github-changes) to generate the changelog.

To use it:

1. tag your commit using [semantic versioning](http://semver.org/)
2. run `npm run generate-changelog`
3. enter your github credentials at the prompt
4. commit
5. push your commit and tags

## Credits

This component was inspired by prior work from:

- [jQuery QueryBuilder](http://querybuilder.js.org/)
- [Angular QueryBuilder](https://github.com/mfauveau/angular-query-builder)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/jakeboone02"><img src="https://avatars1.githubusercontent.com/u/366438?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jake Boone</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=jakeboone02" title="Code">💻</a> <a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=jakeboone02" title="Documentation">📖</a> <a href="#maintenance-jakeboone02" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://quicklens.app/"><img src="https://avatars0.githubusercontent.com/u/156846?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Pavan Podila</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=pavanpodila" title="Code">💻</a> <a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=pavanpodila" title="Documentation">📖</a> <a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=pavanpodila" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/maniax89"><img src="https://avatars2.githubusercontent.com/u/6325237?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andrew Turgeon</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=maniax89" title="Code">💻</a> <a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=maniax89" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/miphe"><img src="https://avatars2.githubusercontent.com/u/393147?v=4?s=100" width="100px;" alt=""/><br /><sub><b>André Drougge</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=miphe" title="Code">💻</a> <a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=miphe" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/oumar-sh"><img src="https://avatars0.githubusercontent.com/u/10144493?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Oumar Sharif DAMBABA</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=oumar-sh" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/artenator"><img src="https://avatars2.githubusercontent.com/u/1946019?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Arte Ebrahimi</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=artenator" title="Code">💻</a> <a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=artenator" title="Documentation">📖</a> <a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=artenator" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/CharlyJazz"><img src="https://avatars0.githubusercontent.com/u/12489333?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Carlos Azuaje</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=CharlyJazz" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/srinivasdamam"><img src="https://avatars0.githubusercontent.com/u/13461208?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Srinivas Damam</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=srinivasdamam" title="Code">💻</a></td>
    <td align="center"><a href="https://matthewreishus.com/"><img src="https://avatars3.githubusercontent.com/u/937354?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Matthew Reishus</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=mreishus" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/duwalanise"><img src="https://avatars2.githubusercontent.com/u/7278569?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Anish Duwal</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=duwalanise" title="Code">💻</a> <a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=duwalanise" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/RomanLamsal1337"><img src="https://avatars1.githubusercontent.com/u/66664277?v=4?s=100" width="100px;" alt=""/><br /><sub><b>RomanLamsal1337</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=RomanLamsal1337" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/snakerxx"><img src="https://avatars2.githubusercontent.com/u/2099820?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dmitriy Kolesnikov</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=xxsnakerxx" title="Code">💻</a></td>
    <td align="center"><a href="http://vitorbarbosa.com/"><img src="https://avatars2.githubusercontent.com/u/86801?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vitor Barbosa</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=vitorhsb" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/lakk1"><img src="https://avatars0.githubusercontent.com/u/9366737?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Laxminarayana</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=lakk1" title="Code">💻</a> <a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=lakk1" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://mundpropaganda.net/"><img src="https://avatars0.githubusercontent.com/u/3873068?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Christian Mund</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=kkkrist" title="Code">💻</a> <a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=kkkrist" title="Documentation">📖</a></td>
    <td align="center"><a href="http://thegalacticdesignbureau.com/"><img src="https://avatars0.githubusercontent.com/u/6655746?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dallas Larsen</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=hellofantastic" title="Code">💻</a></td>
    <td align="center"><a href="https://geekayush.github.io/"><img src="https://avatars2.githubusercontent.com/u/22499864?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ayush Srivastava</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=geekayush" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/fabioespinosa"><img src="https://avatars2.githubusercontent.com/u/10719524?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Fabio Espinosa</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=fabioespinosa" title="Code">💻</a> <a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=fabioespinosa" title="Documentation">📖</a> <a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=fabioespinosa" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://careers.stackoverflow.com/bubenkoff"><img src="https://avatars0.githubusercontent.com/u/427136?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Anatoly Bubenkov</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=bubenkoff" title="Code">💻</a> <a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=bubenkoff" title="Documentation">📖</a> <a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=bubenkoff" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/saurabhnemade"><img src="https://avatars0.githubusercontent.com/u/17445338?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Saurabh Nemade</b></sub></a><br /><a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=saurabhnemade" title="Code">💻</a> <a href="https://github.com/sapientglobalmarkets/react-querybuilder/commits?author=saurabhnemade" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!