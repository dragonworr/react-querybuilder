import { DragIndicator } from '@mui/icons-material';
import { forwardRef } from 'react';
import type { DragHandleProps } from 'react-querybuilder';

const MaterialDragHandle = forwardRef<HTMLSpanElement, DragHandleProps>(
  ({ className, title }, dragRef) => (
    <span ref={dragRef} className={className} title={title}>
      <DragIndicator />
    </span>
  )
);

MaterialDragHandle.displayName = 'MaterialDragHandle';

export default MaterialDragHandle;
