import { forwardRef, type ComponentPropsWithRef } from 'react';
import type { DragHandleProps } from 'react-querybuilder';
import { DragHandle } from 'react-querybuilder';
import type { DragIndicatorType, RQBMaterialComponents } from './types';
import { useMuiComponents } from './useMuiComponents';

type MaterialDragHandleProps = DragHandleProps &
  Omit<ComponentPropsWithRef<DragIndicatorType>, 'path'> & {
    muiComponents?: Partial<RQBMaterialComponents>;
  };

type GetMaterialDragHandleProps = Pick<RQBMaterialComponents, 'DragIndicator'>;
const muiComponentNames: (keyof RQBMaterialComponents)[] = ['DragIndicator'];

export const MaterialDragHandle = forwardRef<HTMLSpanElement, MaterialDragHandleProps>(
  (
    {
      className,
      title,
      path,
      level,
      testID,
      label,
      disabled,
      context,
      validation,
      muiComponents,
      ...otherProps
    },
    dragRef
  ) => {
    const muiComponentsInternal = useMuiComponents(muiComponentNames, muiComponents);
    const key = muiComponentsInternal ? 'mui' : 'no-mui';
    if (!muiComponentsInternal) {
      return (
        <DragHandle
          key={key}
          path={path}
          level={level}
          className={className}
          title={title}
          testID={testID}
          label={label}
          disabled={disabled}
          context={context}
          validation={validation}
        />
      );
    }

    const { DragIndicator } = muiComponentsInternal as GetMaterialDragHandleProps;

    return (
      <span key={key} ref={dragRef} className={className} title={title}>
        <DragIndicator {...otherProps} />
      </span>
    );
  }
);

MaterialDragHandle.displayName = 'MaterialDragHandle';
