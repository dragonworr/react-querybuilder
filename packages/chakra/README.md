## @react-querybuilder/chakra

Official [react-querybuilder](https://npmjs.com/package/react-querybuilder) components for [Chakra UI](https://chakra-ui.com/).

To see them in action, check out the [`react-querybuilder` demo](https://react-querybuilder.js.org/react-querybuilder/) and choose "Chakra UI" from the Style drop-down.

## Installation

```bash
npm i --save react-querybuilder @react-querybuilder/chakra @chakra-ui/icons @chakra-ui/react @chakra-ui/system @emotion/react @emotion/styled framer-motion
# OR
yarn add react-querybuilder @react-querybuilder/chakra @chakra-ui/icons @chakra-ui/react @chakra-ui/system @emotion/react @emotion/styled framer-motion
```

## Usage

```tsx
import QueryBuilder, { RuleGroupType } from 'react-querybuilder';
import { chakraControlElements } from '@react-querybuilder/chakra';

const fields = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
];

const App = () => {
  const [query, setQuery] = useState<RuleGroupType>({ combinator: 'and', rules: [] });

  return (
    <QueryBuilder
      fields={fields}
      query={query}
      onQueryChange={q => setQuery(q)}
      controlElements={chakraControlElements}
    />
  );
};
```

Some additional styling may be necessary, e.g.:

```scss
.chakra-select__wrapper {
  width: fit-content;
  width: -moz-fit-content; // vendor prefix required for Firefox
  display: inline-block;
}

.chakra-input {
  width: auto;
  display: inline-block;
}

.chakra-radio-group {
  display: inline-block;
}
```
