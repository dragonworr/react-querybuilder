import 'core-js';
import ReactDOM from 'react-dom';
import QueryBuilder, {
  defaultValidator,
  Field,
  generateID,
  RuleGroupType,
  RuleType
} from 'react-querybuilder';

const validator = (r: RuleType) => !!r.value;

const fields: Field[] = [
  { name: 'firstName', label: 'First Name', placeholder: 'Enter first name', validator },
  {
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter last name',
    defaultOperator: 'beginsWith',
    validator
  },
  { name: 'age', label: 'Age', inputType: 'number', validator },
  {
    name: 'isMusician',
    label: 'Is a musician',
    valueEditorType: 'checkbox',
    operators: [{ name: '=', label: 'is' }],
    defaultValue: false
  },
  {
    name: 'instrument',
    label: 'Instrument',
    valueEditorType: 'select',
    values: [
      { name: 'Guitar', label: 'Guitar' },
      { name: 'Piano', label: 'Piano' },
      { name: 'Vocals', label: 'Vocals' },
      { name: 'Drums', label: 'Drums' }
    ],
    defaultValue: 'Piano',
    operators: [{ name: '=', label: 'is' }]
  },
  {
    name: 'gender',
    label: 'Gender',
    operators: [{ name: '=', label: 'is' }],
    valueEditorType: 'radio',
    values: [
      { name: 'M', label: 'Male' },
      { name: 'F', label: 'Female' },
      { name: 'O', label: 'Other' }
    ]
  },
  { name: 'height', label: 'Height', validator },
  { name: 'job', label: 'Job', validator }
];

const initialQuery: RuleGroupType = {
  id: generateID(),
  combinator: 'and',
  not: false,
  rules: [
    {
      id: generateID(),
      field: 'firstName',
      value: 'Stev',
      operator: 'beginsWith'
    },
    {
      id: generateID(),
      field: 'lastName',
      value: 'Vai, Vaughan',
      operator: 'in'
    },
    {
      id: generateID(),
      field: 'age',
      operator: '>',
      value: '28'
    },
    {
      id: generateID(),
      combinator: 'or',
      rules: [
        {
          id: generateID(),
          field: 'isMusician',
          operator: '=',
          value: true
        },
        {
          id: generateID(),
          field: 'instrument',
          operator: '=',
          value: 'Guitar'
        }
      ]
    }
  ]
};

const IE11 = () => (
  <QueryBuilder
    fields={fields}
    defaultQuery={initialQuery}
    addRuleToNewGroups
    enableDragAndDrop
    showCloneButtons
    showNotToggle
    validator={defaultValidator}
  />
);

ReactDOM.render(<IE11 />, document.getElementById('ie11'));
