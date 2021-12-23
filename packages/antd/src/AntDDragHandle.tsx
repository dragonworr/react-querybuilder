import { HolderOutlined } from '@ant-design/icons';
import { forwardRef } from 'react';
import type { DragHandleProps } from 'react-querybuilder';

const AntDDragHandle = forwardRef<HTMLSpanElement, DragHandleProps>(
  ({ className, title }, dragRef) => (
    <span ref={dragRef} className={className} title={title}>
      <HolderOutlined />
    </span>
  )
);

AntDDragHandle.displayName = 'AntDDragHandle';

export default AntDDragHandle;
