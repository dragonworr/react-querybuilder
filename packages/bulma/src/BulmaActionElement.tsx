import type { ActionProps } from 'react-querybuilder';

export const BulmaActionElement = ({
  className,
  handleOnClick,
  label,
  title,
  disabled,
  disabledTranslation,
}: ActionProps) => (
  <button
    className={`${className} button is-small`}
    title={disabledTranslation && disabled ? disabledTranslation.title : title}
    onClick={e => handleOnClick(e)}
    disabled={disabled && !disabledTranslation}>
    {disabledTranslation && disabled ? disabledTranslation.label : label}
  </button>
);

BulmaActionElement.displayName = 'BulmaActionElement';
