---
title: Import
---

import TypeScriptAdmonition from './_ts_admonition.md'

<TypeScriptAdmonition />

Use the `parseSQL` function to convert SQL `SELECT` statements into a format suitable for the `<QueryBuilder />` component's `query` prop. The function signature is:

```ts
function parseSQL(sql: string, options?: ParseSQLOptions): RuleGroupTypeAny;
```

`parseSQL` takes a SQL `SELECT` statement (either the full statement or the `WHERE` clause by itself). Try it out in the [demo](https://react-querybuilder.github.io/react-querybuilder/) by clicking the "Load from SQL" button.

The optional second parameter to `parseSQL` is an options object that configures how the function handles named or anonymous bind variables within the SQL string.

## Basic usage

Running any of the following statements will produce the same result (see below):

```ts
parseSQL(`SELECT * FROM t WHERE firstName = 'Steve' AND lastName = 'Vai'`);

parseSQL(`SELECT * FROM t WHERE firstName = ? AND lastName = ?`, {
  params: ['Steve', 'Vai']
});

parseSQL(`SELECT * FROM t WHERE firstName = :p1 AND lastName = :p2`, {
  params: { p1: 'Steve', p2: 'Vai' }
});

parseSQL(`SELECT * FROM t WHERE firstName = $p1 AND lastName = $p2`, {
  params: { p1: 'Steve', p2: 'Vai' },
  paramPrefix: '$'
});
```

Output (`RuleGroupType`):

```ts
{
  combinator: "and",
  rules: [
    {
      field: "firstName",
      operator: "=",
      value: "Steve"
    },
    {
      field: "lastName",
      operator: "=",
      value: "Vai"
    }
  ]
}
```

### Lists as arrays

To generate actual arrays instead of comma-separated strings for lists of values following `IN` and `BETWEEN` operators, use the `listsAsArrays` option.

```ts
parseSQL(`SELECT * FROM t WHERE lastName IN ('Vai', 'Vaughan') AND age BETWEEN 20 AND 100`, {
  listsAsArrays: true;
});
// Output:
{
  combinator: "and",
  rules: [
    {
      field: "lastName",
      operator: "in",
      value: ["Vai", "Vaughan"]
    },
    {
      field: "age",
      operator: "between",
      value: [20, 100]
    }
  ]
}
```

## Independent combinators

When the `independentCombinators` option is `true`, `parseSQL` will output a query with combinator identifiers between sibling rules/groups.

```ts
parseSQL(
  `SELECT * FROM t WHERE firstName = 'Steve' AND lastName = 'Vai'`,
  { independentCombinators: true }
);
```

Output (`RuleGroupTypeIC`):

```ts
{
  rules: [
    {
      field: "firstName",
      operator: "=",
      value: "Steve"
    },
    "and",
    {
      field: "lastName",
      operator: "=",
      value: "Vai"
    }
  ]
}
```
