## @react-querybuilder/bootstrap

Official [react-querybuilder](https://npmjs.com/package/react-querybuilder) components for [Bootstrap](https://getbootstrap.com/).

To see them in action, check out the [`react-querybuilder` demo](https://react-querybuilder.js.org/react-querybuilder/#style=bootstrap) or [load the example in CodeSandbox](https://codesandbox.io/s/github/react-querybuilder/react-querybuilder/tree/main/examples/bootstrap).

## Installation

```bash
npm i --save react-querybuilder @react-querybuilder/bootstrap bootstrap bootstrap-icons
# OR
yarn add react-querybuilder @react-querybuilder/bootstrap bootstrap bootstrap-icons
```

## Usage

This package exports `bootstrapControlClassnames` and `bootstrapControlElements` which can be assigned directly to the `controlClassnames` and `controlElements` props, respectively, on `<QueryBuilder />`. Each component is also exported individually. However, the recommended usage is to wrap a `<QueryBuilder />` element in `<QueryBuilderBootstrap />`, like this:

```tsx
import { QueryBuilderBootstrap } from '@react-querybuilder/bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.scss';
import 'bootstrap/scss/bootstrap.scss';
import { QueryBuilder, RuleGroupType } from 'react-querybuilder';

const fields = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
];

const App = () => {
  const [query, setQuery] = useState<RuleGroupType>({ combinator: 'and', rules: [] });

  return (
    <QueryBuilderBootstrap>
      <QueryBuilder fields={fields} query={query} onQueryChange={q => setQuery(q)} />
    </QueryBuilderBootstrap>
  );
};
```

Some additional styling may be necessary, e.g.:

```css
.queryBuilder .form-control,
.queryBuilder .form-select {
  display: inline-block;
  width: auto;
}
```
