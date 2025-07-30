import React from 'react';
import {useDraggable} from '@dnd-kit/core';
import { Cross, Grip, Plus } from 'lucide-react';

export default function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: 'draggable',
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <button ref={setNodeRef} style={style} className='flex flex-row justify-center items-center bg-muted/50 p-1 rounded-xl gap-1'>
      {props.children}
      <div {...listeners} {...attributes} className=' p-1'>
        <Grip className='cursor-pointer'/>
      </div>
    </button>
  );
}