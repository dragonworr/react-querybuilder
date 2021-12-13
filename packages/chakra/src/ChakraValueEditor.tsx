import { Checkbox, Input, Radio, RadioGroup, Select, Stack } from '@chakra-ui/react';
import { useEffect } from 'react';
import type { ValueEditorProps } from 'react-querybuilder';

const ChakraValueEditor = ({
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
        <Select
          className={className}
          value={value}
          size="xs"
          variant="filled"
          isDisabled={disabled}
          onChange={e => handleOnChange(e.target.value)}>
          {values &&
            values.map(v => (
              <option key={v.name} value={v.name}>
                {v.label}
              </option>
            ))}
        </Select>
      );

    case 'checkbox':
      return (
        <Checkbox
          className={className}
          size="sm"
          isDisabled={disabled}
          onChange={e => handleOnChange(e.target.checked)}
          isChecked={!!value}
        />
      );

    case 'radio':
      return (
        <RadioGroup
          className={className}
          title={title}
          value={value}
          onChange={handleOnChange}
          isDisabled={disabled}>
          <Stack direction="row">
            {values!.map(v => (
              <Radio key={v.name} value={v.name} size="sm">
                {v.label}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      );

    default:
      return (
        <Input
          type={inputTypeCoerced}
          value={value}
          title={title}
          size="xs"
          variant="filled"
          isDisabled={disabled}
          className={className}
          placeholder={placeHolderText}
          onChange={e => handleOnChange(e.target.value)}
        />
      );
  }
};

ChakraValueEditor.displayName = 'ChakraValueEditor';

export default ChakraValueEditor;
