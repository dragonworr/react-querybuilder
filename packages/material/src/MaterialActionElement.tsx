import Button from '@mui/material/Button';
import { ThemeProvider, useTheme } from '@mui/system';
import type { ComponentPropsWithoutRef } from 'react';
import type { ActionWithRulesProps } from 'react-querybuilder';

type MaterialActionProps = ActionWithRulesProps & ComponentPropsWithoutRef<typeof Button>;

export const MaterialActionElement = ({
  className,
  handleOnClick,
  label,
  title,
  disabled,
  disabledTranslation,
  // Props that should not be in extraProps
  testID: _testID,
  rules: _rules,
  level: _level,
  path: _path,
  context: _context,
  validation: _validation,
  ...extraProps
}: MaterialActionProps) => {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Button
        variant="contained"
        color="primary"
        className={className}
        title={disabledTranslation && disabled ? disabledTranslation.title : title}
        size="small"
        disabled={disabled && !disabledTranslation}
        onClick={e => handleOnClick(e)}
        {...extraProps}>
        {disabledTranslation && disabled ? disabledTranslation.label : label}
      </Button>
    </ThemeProvider>
  );
};

MaterialActionElement.displayName = 'MaterialActionElement';
