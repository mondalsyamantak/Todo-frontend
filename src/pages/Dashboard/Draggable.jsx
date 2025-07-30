import React from 'react';
import {useDraggable} from '@dnd-kit/core';
import { Cross, Plus } from 'lucide-react';

export default function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: 'draggable',
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <button ref={setNodeRef} style={style} >
      {props.children}
      <div {...listeners} {...attributes}>
        <Plus className='cursor-pointer'/>
      </div>
    </button>
  );
}