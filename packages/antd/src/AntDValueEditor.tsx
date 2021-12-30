import { Checkbox, Input, Radio, Select } from 'antd';
import { useEffect } from 'react';
import type { ValueEditorProps } from 'react-querybuilder';
import { toOptions } from './utils';

const AntDValueEditor = ({
  fieldData,
  operator,
  value,
  handleOnChange,
  title,
  className,
  type,
  inputType,
  values,
  disabled,
}: ValueEditorProps) => {
  useEffect(() => {
    if (
      inputType === 'number' &&
      !['between', 'notBetween', 'in', 'notIn'].includes(operator) &&
      typeof value === 'string' &&
      value.includes(',')
    ) {
      handleOnChange('');
    }
  }, [inputType, operator, value, handleOnChange]);

  if (operator === 'null' || operator === 'notNull') {
    return null;
  }

  const placeHolderText = fieldData?.placeholder ?? '';
  const inputTypeCoerced = ['between', 'notBetween', 'in', 'notIn'].includes(operator)
    ? 'text'
    : inputType || 'text';

  switch (type) {
    case 'select':
      return (
        <span title={title} className={className}>
          <Select onChange={v => handleOnChange(v)} value={value} disabled={disabled}>
            {toOptions(values)}
          </Select>
        </span>
      );

    case 'checkbox':
      return (
        <span title={title}>
          <Checkbox
            type="checkbox"
            className={className}
            disabled={disabled}
            onChange={e => handleOnChange(e.target.checked)}
            checked={!!value}
          />
        </span>
      );

    case 'radio':
      return (
        <span className={className} title={title}>
          {values!.map(v => (
            <Radio
              key={v.name}
              value={v.name}
              checked={value === v.name}
              disabled={disabled}
              onChange={e => handleOnChange(e.target.value)}>
              {v.label}
            </Radio>
          ))}
        </span>
      );

    default:
      return (
        <Input
          type={inputTypeCoerced}
          value={value}
          title={title}
          className={className}
          disabled={disabled}
          placeholder={placeHolderText}
          onChange={e => handleOnChange(e.target.value)}
        />
      );
  }
};

AntDValueEditor.displayName = 'AntDValueEditor';

export default AntDValueEditor;
