import {
  getFirstOption,
  standardClassnames,
  useValueEditor,
  ValueEditor,
  type ValueEditorProps,
} from 'react-querybuilder';
import { BulmaValueSelector } from './BulmaValueSelector';

export const BulmaValueEditor = (props: ValueEditorProps) => {
  const { valArray, betweenValueHandler } = useValueEditor({
    handleOnChange: props.handleOnChange,
    inputType: props.inputType,
    operator: props.operator,
    value: props.value,
    type: props.type,
    listsAsArrays: props.listsAsArrays,
    parseNumbers: props.parseNumbers,
    values: props.values,
  });

  if (props.operator === 'null' || props.operator === 'notNull') {
    return null;
  }

  const placeHolderText = props.fieldData?.placeholder ?? '';
  const { values = [] } = props;

  if (
    (props.operator === 'between' || props.operator === 'notBetween') &&
    (props.type === 'select' || props.type === 'text')
  ) {
    const editors = ['from', 'to'].map((key, i) => {
      if (props.type === 'text') {
        return (
          <input
            key={key}
            type={props.inputType || 'text'}
            placeholder={placeHolderText}
            value={valArray[i] ?? ''}
            className={`${standardClassnames.valueListItem} input`}
            disabled={props.disabled}
            onChange={e => betweenValueHandler(e.target.value, i)}
          />
        );
      }
      return (
        <BulmaValueSelector
          key={key}
          {...props}
          className={standardClassnames.valueListItem}
          handleOnChange={v => betweenValueHandler(v, i)}
          disabled={props.disabled}
          value={valArray[i] ?? getFirstOption(values)}
          options={values}
          listsAsArrays={props.listsAsArrays}
        />
      );
    });

    return (
      <span data-testid={props.testID} className={props.className} title={props.title}>
        {editors[0]}
        {props.separator}
        {editors[1]}
      </span>
    );
  }

  switch (props.type) {
    case 'select':
    case 'multiselect':
      return (
        <BulmaValueSelector
          {...props}
          title={props.title}
          className={props.className}
          handleOnChange={props.handleOnChange}
          options={values}
          value={props.value}
          disabled={props.disabled}
          multiple={props.type === 'multiselect'}
          listsAsArrays={props.listsAsArrays}
        />
      );

    case 'textarea':
      return (
        <div className={`${props.className} control`}>
          <ValueEditor skipHook {...props} className="textarea" />
        </div>
      );

    case 'switch':
    case 'checkbox':
      return (
        <label title={props.title} className={`${props.className} checkbox`}>
          <ValueEditor skipHook {...props} title="" className="" />
        </label>
      );

    case 'radio':
      return (
        <div className={`${props.className} control`} title={props.title}>
          {values.map(v => (
            <label key={v.name} className="radio">
              <input
                type="radio"
                value={v.name}
                checked={props.value === v.name}
                onChange={() => props.handleOnChange(v.name)}
                disabled={props.disabled}
              />
              {v.label}
            </label>
          ))}
        </div>
      );
  }

  return (
    <div className={`${props.className} control`}>
      <ValueEditor skipHook {...props} disabled={props.disabled} className="input" />
    </div>
  );
};

BulmaValueEditor.displayName = 'BulmaValueEditor';
