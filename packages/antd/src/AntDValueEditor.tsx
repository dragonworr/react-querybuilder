import { Checkbox, DatePicker, Input, Radio, Switch, TimePicker } from 'antd';
import moment from 'moment';
import {
  joinWith,
  splitBy,
  standardClassnames,
  toArray,
  useValueEditor,
  type ValueEditorProps,
} from 'react-querybuilder';
import { AntDValueSelector } from './AntDValueSelector';

export const AntDValueEditor = ({
  fieldData,
  operator,
  value,
  handleOnChange,
  title,
  className,
  type,
  inputType,
  values = [],
  listsAsArrays,
  valueSource: _vs,
  disabled,
  testID,
  ...props
}: ValueEditorProps) => {
  useValueEditor({ handleOnChange, inputType, operator, value });

  if (operator === 'null' || operator === 'notNull') {
    return null;
  }

  const placeHolderText = fieldData?.placeholder ?? '';
  const inputTypeCoerced =
    ['between', 'notBetween', 'in', 'notIn'].includes(operator) &&
    // This next line is not in the default ValueEditor -- we can use
    // antd's RangePicker to handle "between" and "notBetween".
    !['date', 'datetime-local'].includes(`${inputType}`)
      ? 'text'
      : inputType || 'text';

  if ((operator === 'between' || operator === 'notBetween') && type === 'select') {
    const valArray = toArray(value);
    const selector1handler = (v: string) => {
      const val = [v, valArray[1] ?? values[0]?.name, ...valArray.slice(2)];
      handleOnChange(listsAsArrays ? val : joinWith(val, ','));
    };
    const selector2handler = (v: string) => {
      const val = [valArray[0], v, ...valArray.slice(2)];
      handleOnChange(listsAsArrays ? val : joinWith(val, ','));
    };
    return (
      <span data-testid={testID} className={className} title={title}>
        <AntDValueSelector
          {...props}
          className={standardClassnames.valueListItem}
          handleOnChange={selector1handler}
          disabled={disabled}
          value={valArray[0]}
          options={values}
          listsAsArrays={listsAsArrays}
        />
        <AntDValueSelector
          {...props}
          className={standardClassnames.valueListItem}
          handleOnChange={selector2handler}
          disabled={disabled}
          value={valArray[1]}
          options={values}
          listsAsArrays={listsAsArrays}
        />
      </span>
    );
  }

  switch (type) {
    case 'select':
    case 'multiselect':
      return (
        <AntDValueSelector
          {...props}
          className={className}
          handleOnChange={handleOnChange}
          options={values}
          value={value}
          title={title}
          disabled={disabled}
          multiple={type === 'multiselect'}
          listsAsArrays={listsAsArrays}
        />
      );

    case 'textarea':
      return (
        <Input.TextArea
          value={value}
          title={title}
          className={className}
          disabled={disabled}
          placeholder={placeHolderText}
          onChange={e => handleOnChange(e.target.value)}
        />
      );

    case 'switch':
      return (
        <Switch
          checked={!!value}
          title={title}
          className={className}
          disabled={disabled}
          onChange={v => handleOnChange(v)}
        />
      );

    case 'checkbox':
      return (
        <span title={title} className={className}>
          <Checkbox
            type="checkbox"
            disabled={disabled}
            onChange={e => handleOnChange(e.target.checked)}
            checked={!!value}
          />
        </span>
      );

    case 'radio':
      return (
        <span className={className} title={title}>
          {values.map(v => (
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
  }

  switch (inputTypeCoerced) {
    case 'date':
    case 'datetime-local':
      return operator === 'between' || operator === 'notBetween' ? (
        <DatePicker.RangePicker
          value={
            typeof value === 'string' && /^[^,]+,[^,]+$/.test(value)
              ? (splitBy(value, ',').map(v => moment(v)) as [moment.Moment, moment.Moment])
              : undefined
          }
          showTime={inputTypeCoerced === 'datetime-local'}
          className={className}
          disabled={disabled}
          placeholder={[placeHolderText, placeHolderText]}
          onChange={dates =>
            // TODO: the next line is currently untested (see the
            // "should render a date range picker" test in ./AntD.test.tsx)
            /* istanbul ignore next */
            handleOnChange(dates?.map(d => d?.format(moment.HTML5_FMT.DATE)).join(','))
          }
        />
      ) : (
        <DatePicker
          value={value ? moment(value) : null}
          showTime={inputTypeCoerced === 'datetime-local'}
          className={className}
          disabled={disabled}
          placeholder={placeHolderText}
          onChange={(_d, dateString) => handleOnChange(dateString)}
        />
      );

    case 'time':
      return (
        <TimePicker
          value={value ? moment(value, 'HH:mm:ss') : null}
          className={className}
          disabled={disabled}
          placeholder={placeHolderText}
          onChange={d => handleOnChange(d?.format('HH:mm:ss') ?? '')}
        />
      );
  }

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
};

AntDValueEditor.displayName = 'AntDValueEditor';
