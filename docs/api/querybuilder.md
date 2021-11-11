---
title: <QueryBuilder />
---

import TypeScriptAdmonition from './_ts_admonition.md'

<TypeScriptAdmonition />

The default export of `react-querybuilder` is the `<QueryBuilder />` React component.

## Props

:::note

All props are optional.

:::

### `fields`

`Field[]`

The array of [fields](../typescript#fields) that should be used.

:::tip

Field objects can also contain other data. Each field object will be passed to the appropriate `OperatorSelector` and `ValueEditor` components as `fieldData` (see the section on [`controlElements`](#controlelements)).

:::

:::caution

Although not strictly required, a missing or empty `fields` array severely limits the functionality of the `<QueryBuilder />` component.

:::

### `onQueryChange`

`(query: RuleGroupTypeAny) => void`

This is a callback function that is invoked anytime the query configuration changes. The `query` is provided as an object of type `RuleGroupType` by default:

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

If the `independendCombinators` prop is provided, then the `query` argument will be of type `RuleGroupTypeIC`, which looks like this:

```json
{
  "not": false,
  "rules": [
    {
      "field": "firstName",
      "operator": "null",
      "value": ""
    },
    "and",
    {
      "field": "lastName",
      "operator": "null",
      "value": ""
    },
    "and",
    {
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

### `query`

`RuleGroupTypeAny`

The initial query as an object of type `RuleGroupType` (or `RuleGroupTypeIC` if [`independendCombinators`](#independendCombinators) is also provided).

The `query` prop follows the same format as the parameter passed to the [`onQueryChange`](#onquerychange) callback since they are meant to be used together to control the component. See [the demo source](https://github.com/react-querybuilder/react-querybuilder/blob/master/demo/main.tsx) for examples.

### `context`

`any`

A "bucket" for passing arbitrary props down to custom components (default components will ignore this prop). The `context` prop is passed to each and every component, so it's accessible anywhere in the `QueryBuilder` component tree.

### `operators`

`NameLabelPair[]`

The array of operators that should be used. The default operators include:

```ts
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
  { name: 'notIn', label: 'not in' },
  { name: 'between', label: 'between' },
  { name: 'notBetween', label: 'not between' }
];
```

### `combinators`

`NameLabelPair[]`

The array of combinators that should be used for RuleGroups. The default set includes:

```ts
[
  { name: 'and', label: 'AND' },
  { name: 'or', label: 'OR' }
];
```

### `controlElements`

```ts
interface Controls {
  addGroupAction?: React.ComponentType<ActionWithRulesProps>;
  addRuleAction?: React.ComponentType<ActionWithRulesProps>;
  cloneGroupAction?: React.ComponentType<ActionWithRulesProps>;
  cloneRuleAction?: React.ComponentType<ActionProps>;
  combinatorSelector?: React.ComponentType<CombinatorSelectorProps>;
  dragHandle?: React.ForwardRefExoticComponent<DragHandleProps & React.RefAttributes<HTMLSpanElement>>;
  fieldSelector?: React.ComponentType<FieldSelectorProps>;
  notToggle?: React.ComponentType<NotToggleProps>;
  operatorSelector?: React.ComponentType<OperatorSelectorProps>;
  removeGroupAction?: React.ComponentType<ActionWithRulesProps>;
  removeRuleAction?: React.ComponentType<ActionProps>;
  rule?: React.ComponentType<RuleProps>;
  ruleGroup?: React.ComponentType<RuleGroupProps>;
  valueEditor?: React.ComponentType<ValueEditorProps>;
}
```

This is a custom controls object that allows you to override the default control elements. The following control overrides are supported:

#### `addGroupAction`

By default a `<button />` is used. The following props are passed:

```ts
interface ActionWithRulesProps {
  label: string; // translations.addGroup.label, e.g. "+Group"
  title: string; // translations.addGroup.title, e.g. "Add group"
  className: string; // CSS classNames to be applied
  handleOnClick: (e: React.MouseEvent) => void; // Callback function to invoke adding a <RuleGroup />
  rules: (RuleGroupType | RuleType)[]; // Provides the number of rules already present for this group
  level: number; // The level of the current group
  context: any; // Container for custom props that are passed to all components
  validation: boolean | ValidationResult; // validation result of this group
}
```

#### `cloneGroupAction`

By default a `<button />` is used. The following props are passed:

```ts
interface ActionWithRulesProps {
  label: string; // translations.addGroup.label, e.g. "+Group"
  title: string; // translations.addGroup.title, e.g. "Add group"
  className: string; // CSS classNames to be applied
  handleOnClick: (e: React.MouseEvent) => void; // Callback function to invoke adding a <RuleGroup />
  rules: (RuleGroupType | RuleType)[]; // Provides the number of rules already present for this group
  level: number; // The level of the current group
  context: any; // Container for custom props that are passed to all components
  validation: boolean | ValidationResult; // validation result of this group
}
```

#### `removeGroupAction`

By default a `<button />` is used. The following props are passed:

```ts
interface ActionWithRulesProps {
  label: string; // translations.removeGroup.label, e.g. "x"
  title: string; // translations.removeGroup.title, e.g. "Remove group"
  className: string; // CSS classNames to be applied
  handleOnClick: (e: React.MouseEvent) => void; // Callback function to invoke adding a <RuleGroup />
  rules: (RuleGroupType | RuleType)[]; // Provides the number of rules already present for this group
  level: number; // The level of the current group
  context: any; // Container for custom props that are passed to all components
  validation: boolean | ValidationResult; // validation result of this group
}
```

#### `addRuleAction`

By default a `<button />` is used. The following props are passed:

```ts
interface ActionWithRulesProps {
  label: string; // translations.addGroup.label, e.g. "+Rule"
  title: string; // translations.addGroup.title, e.g. "Add rule"
  className: string; // CSS classNames to be applied
  handleOnClick: (e: React.MouseEvent) => void; // Callback function to invoke adding a <RuleGroup />
  rules: (RuleGroupType | RuleType)[]; // Provides the number of rules already present for this group
  level: number; // The level of the current group
  context: any; // Container for custom props that are passed to all components
  validation: boolean | ValidationResult; // validation result of this group
}
```

#### `cloneRuleAction`

By default a `<button />` is used. The following props are passed:

```ts
interface ActionProps {
  label: string; // translations.addGroup.label, e.g. "+Rule"
  title: string; // translations.addGroup.title, e.g. "Add rule"
  className: string; // CSS classNames to be applied
  handleOnClick: (e: React.MouseEvent) => void; // Callback function to invoke adding a <RuleGroup />
  level: number; // The level of the current group
  context: any; // Container for custom props that are passed to all components
  validation: boolean | ValidationResult; // validation result of this rule
}
```

#### `removeRuleAction`

By default a `<button />` is used. The following props are passed:

```ts
interface ActionProps {
  label: string; // translations.removeRule.label, e.g. "x"
  title: string; // translations.removeRule.title, e.g. "Remove rule"
  className: string; // CSS classNames to be applied
  handleOnClick: (e: React.MouseEvent) => void; // Callback function to invoke adding a <RuleGroup />
  level: number; // The level of the current group
  context: any; // Container for custom props that are passed to all components
  validation: boolean | ValidationResult; // validation result of this rule
}
```

#### `combinatorSelector`

By default a `<select />` is used. The following props are passed:

```ts
interface CombinatorSelectorProps {
  options: NameLabelPair[]; // Same as 'combinators' passed into QueryBuilder
  value: string; // Selected combinator from the existing query representation, if any
  className: string; // CSS classNames to be applied
  handleOnChange: (value: any) => void; // Callback function to update query representation
  rules: (RuleGroupType | RuleType)[]; // Provides the number of rules already present for this group
  level: number; // The level of the current group
  context: any; // Container for custom props that are passed to all components
  validation: boolean | ValidationResult; // validation result of this group
}
```

#### `dragHandle`

By default a `<span />` is used. Note that this component must be based on `React.forwardRef`, and must always render an element (i.e. never return `null`). The following props are passed:

```ts
interface DragHandleProps {
  title: string; // translations.dragHandle.title, e.g. "Drag handle"
  className: string; // CSS classNames to be applied
  level: number; // The level of the current group
  context: any; // Container for custom props that are passed to all components
  validation: boolean | ValidationResult; // validation result of this group
  label: string; // translations.dragHandle.label, e.g. "⁞⁞"
}
```

#### `fieldSelector`

By default a `<select />` is used. The following props are passed:

```ts
interface FieldSelectorProps {
  options: Field[]; // Same as 'fields' passed into QueryBuilder
  value: string; // Selected field from the existing query representation, if any
  title: string; // translations.fields.title, e.g. "Fields"
  operator: string; // Selected operator from the existing query representation, if any
  className: string; // CSS classNames to be applied
  handleOnChange: (value: any) => void; // Callback function to update query representation
  level: number; // The level the group this rule belongs to
  context: any; // Container for custom props that are passed to all components
  validation: boolean | ValidationResult; // validation result of this rule
}
```

#### `operatorSelector`

By default a `<select />` is used. The following props are passed:

```ts
interface OperatorSelectorProps {
  field: string; // Field name corresponding to this rule
  fieldData: Field; // The entire object from the fields array for this field
  options: NameLabelPair[]; // Return value of getOperators(field)
  value: string; // Selected operator from the existing query representation, if any
  title: string; // translations.operators.title, e.g. "Operators"
  className: string; // CSS classNames to be applied
  handleOnChange: (value: any) => void; // Callback function to update query representation
  level: number; // The level the group this rule belongs to
  context: any; // Container for custom props that are passed to all components
  validation: boolean | ValidationResult; // validation result of this rule
}
```

#### `valueEditor`

By default an `<input type="text" />` is used. The following props are passed:

```ts
interface ValueEditorProps {
  field: string; // Field name corresponding to this rule
  fieldData: Field; // The entire object from the fields array for this field
  operator: string; // Operator name corresponding to this rule
  value: string; // Value from the existing query representation, if any
  title: string; // translations.value.title, e.g. "Value"
  handleOnChange: (value: any) => void; // Callback function to update the query representation
  type: 'text' | 'select' | 'checkbox' | 'radio'; // Type of editor to be displayed
  inputType: string; // @type of <input> if `type` is "text"
  values: any[]; // List of available values for this rule
  level: number; // The level the group this rule belongs to
  className: string; // CSS classNames to be applied
  context: any; // Container for custom props that are passed to all components
  validation: boolean | ValidationResult; // validation result of this rule
}
```

#### `notToggle`

By default, `<label><input type="checkbox" />Not</label>` is used. The following props are passed:

```ts
interface NotToggleProps {
  checked: boolean; // Whether the input should be checked or not
  handleOnChange: (checked: boolean) => void; // Callback function to update the query representation
  title: string; // translations.notToggle.title, e.g. "Invert this group"
  level: number; // The level of the group
  className: string; // CSS classNames to be applied
  context: any; // Container for custom props that are passed to all components
  validation: boolean | ValidationResult; // validation result of this group
}
```

#### `ruleGroup`

By default, `<RuleGroup />` is used. The following props are passed:

```ts
interface RuleGroupProps {
  id?: string; // Unique identifier for this rule group
  path: number[]; // path of indexes through a rule group hierarchy
  combinator: string; // Combinator for this group, e.g. "and" / "or"
  rules: RuleOrGroupArray; // List of rules and/or sub-groups for this group
  translations: Translations; // The full translations object
  schema: Schema; // See `Schema` on the TypeScript page
  not: boolean; // Whether or not to invert this group
  context: any; // Container for custom props that are passed to all components
}
```

#### `rule`

By default, `<Rule />` is used. The following props are passed:

```ts
interface RuleProps {
  id?: string; // Unique identifier for this rule
  path: number[]; // path of indexes through a rule group hierarchy
  field: string; // Field name for this rule
  operator: string; // Operator name for this rule
  value: any; // Value for this rule
  translations: Translations; // The full translations object
  schema: Schema; // See `Schema` on the TypeScript page
  context: any; // Container for custom props that are passed to all components
}
```

### `getOperators`

`(field: string) => NameLabelPair[] | null`

This is a callback function invoked to get the list of allowed operators for the given field. If `null` is returned, the default operators are used.

### `getValueEditorType`

`(field: string, operator: string) => ValueEditorType`

This is a callback function invoked to get the type of `ValueEditor` for the given field and operator. Allowed values are `"text"` (the default if the function is not provided or if `null` is returned), `"select"`, `"checkbox"`, and `"radio"`.

### `getInputType`

`(field: string, operator: string) => string`

This is a callback function invoked to get the `type` of `<input />` for the given field and operator (only applicable when `getValueEditorType` returns `"text"` or a falsy value). If no function is provided, `"text"` is used as the default.

### `getValues`

`(field: string, operator: string) => NameLabelPair[]`

This is a callback function invoked to get the list of allowed values for the given field and operator (only applicable when `getValueEditorType` returns `"select"` or `"radio"`). If no function is provided, an empty array is used as the default.

### `getDefaultField`

`string | ((fieldsData: Field[]) => string)`

The default field for new rules. This can be a string identifying the default field, or a function that returns a field name.

### `getDefaultOperator`

`string | ((field: string) => string)`

The default operator for new rules. This can be a string identifying the default operator, or a function that returns an operator name.

### `getDefaultValue`

`(rule: RuleType) => any`

This function returns the default value for new rules.

### `onAddRule`

`(rule: RuleType, parentPath: number[], query: RuleGroupTypeAny) => RuleType | false`

This callback is invoked before a new rule is added. The function should either manipulate the rule and return it as an object of type `RuleType`, or return `false` to cancel the addition of the rule. You can use `findRule(parentId, query)` to locate the parent group to which the new rule will be added among the entire query hierarchy.

:::tip

To completely [prevent the addition of new rules](../tips/limit-groups), pass `controlElements={{ addRuleAction: () => null }}` which will hide the "+Rule" button.

:::

### `onAddGroup`

`<RG extends RuleGroupTypeAny>(ruleGroup: RG, parentPath: number[], query: RG) => RG | false`

This callback is invoked before a new group is added. The function should either manipulate the group and return it as an object of the same type (either `RuleGroupType` or `RuleGroupTypeIC`), or return `false` to cancel the addition of the group. You can use `findPath(parentPath, query)` to locate the parent group to which the new group will be added within the query hierarchy.

:::tip

To completely [prevent the addition of new groups](../tips/limit-groups), pass `controlElements={{ addGroupAction: () => null }}` which will hide the "+Group" button.

:::

### `controlClassnames`

This prop can be used to assign specific `CSS` classes to various controls that are rendered by the `<QueryBuilder />` component. This is an object with the following signature:

```ts
interface Classnames {
  queryBuilder?: string; // Root <div> element
  ruleGroup?: string; // <div> containing the RuleGroup
  header?: string; // <div> containing the RuleGroup header controls
  body?: string; // <div> containing the RuleGroup child rules/groups
  combinators?: string; // <select> control for combinators
  addRule?: string; // <button> to add a Rule
  addGroup?: string; // <button> to add a RuleGroup
  cloneRule?: string; // <button> to clone a Rule
  cloneGroup?: string; // <button> to clone a RuleGroup
  removeGroup?: string; // <button> to remove a RuleGroup
  notToggle?: string; // <label> on the "not" toggle
  rule?: string; // <div> containing the Rule
  fields?: string; // <select> control for fields
  operators?: string; // <select> control for operators
  value?: string; // <input> for the field value
  removeRule?: string; // <button> to remove a Rule
  dragHandle?: string; // <span> as drag-and-drop handle
}
```

### `translations`

This prop can be used to override translatable texts applied to various controls that are created by the `<QueryBuilder />` component. The default object is:

```ts
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
    label: "Not",
    title: "Invert this group",
  },
  cloneRule: {
    label: '⧉',
    title: 'Clone rule'
  },
  cloneRuleGroup: {
    label: '⧉',
    title: 'Clone group'
  },
  dragHandle: {
    label: '⁞⁞',
    title: 'Drag handle'
  }
}
```

:::note

The `translations` prop is optional, and each top-level property in the `translations` object is optional, but all sub-properties are required for each defined top-level-property. For example, you cannot pass `translations={{ addRule: { label: 'New Rule' } }}`, because the `title` sub-property is required within the `addRule` object.

:::

### `showCombinatorsBetweenRules`

`boolean` (default `false`)

Pass `true` to show the combinators (and/or) between rules and rule groups instead of at the top of rule groups. This can make some queries easier to understand as it encourages a more natural style of reading.

### `showNotToggle`

`boolean` (default `false`)

Pass `true` to show the "Not" (aka inversion) toggle switch for each rule group.

### `showCloneButtons`

`boolean` (default `false`)

Pass `true` to show the "Clone rule" and "Clone group" buttons.

### `resetOnFieldChange`

`boolean` (default `true`)

Pass `false` to avoid resetting the operator and value when the field changes.

### `resetOnOperatorChange`

`boolean` (default `false`)

Pass `true` to reset the value when the operator changes.

### `enableMountQueryChange`

`boolean` (default `true`)

Pass `false` to disable the `onQueryChange` call on mount of the component which will set the default value.

### `autoSelectField`

`boolean` (default `true`)

Pass `false` to add an empty option (`"------"`) to the `fields` array as the first element (which will be selected by default for new rules). When the empty field option is selected, the operator and value components will not display for that rule.

### `addRuleToNewGroups`

`boolean` (default `false`)

Pass `true` to automatically add a rule to new groups. If a `query` prop is not passed in, a rule will be added to the root group when the component is mounted. If a `query` prop is passed in with an empty `rules` array, no rule will be added automatically.

### `independendCombinators`

`boolean` (default `false`)

Pass `true` to insert an independent combinator selector between each rule/group in a rule group. The combinator selector at the group level will not be available. This is similar to the [`showCombinatorsBetweenRules`](#showcombinatorsbetweenrules) option, except that each combinator selector is independent. You may find that users take to this configuration more easily, as it can allow them to express queries more like they would in natural language.

### `enableDragAndDrop`

`boolean` (default `false`)

Pass `true` to display a drag handle to the left of each group header and rule. Clicking and dragging the handle element allows visual reordering of rules and groups.

### `validator`

`QueryValidator`

This is a callback function that is executed each time `QueryBuilder` renders. The return value should be a boolean (`true` for valid queries, `false` for invalid) or an object whose keys are the `id`s of each rule and group in the query tree. If such an object is returned, the values associated to each key should be a boolean (`true` for valid rules/groups, `false` for invalid) or an object with a `valid` boolean property and an optional `reasons` array. The full object will be passed to each rule and group component, and all sub-components of each rule/group will receive the value associated with the rule's or group's `id`. See the [Validation](./validation) documentation for more information.
