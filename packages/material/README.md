## @react-querybuilder/material

Official [react-querybuilder](https://npmjs.com/package/react-querybuilder) components for [MUI](https://mui.com/)/[Material Design](https://material.io/design).

To see them in action, check out the [`react-querybuilder` demo](https://react-querybuilder.js.org/react-querybuilder/) and choose "Material" from the Style drop-down.

## Installation

```bash
npm i --save react-querybuilder @react-querybuilder/material @mui/icons-material @mui/material
# OR
yarn add react-querybuilder @react-querybuilder/material @mui/icons-material @mui/material
```

## Usage

```tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { materialControlElements } from '@react-querybuilder/material';
import { QueryBuilder, RuleGroupType } from 'react-querybuilder';

const muiTheme = createTheme();

const fields = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
];

const App = () => {
  const [query, setQuery] = useState<RuleGroupType>({ combinator: 'and', rules: [] });

  return (
    <ThemeProvider theme={muiTheme}>
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={q => setQuery(q)}
        controlElements={materialControlElements}
      />
    </ThemeProvider>
  );
};
```
