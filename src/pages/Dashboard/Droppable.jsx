import {useDroppable} from '@dnd-kit/core';


export default function Droppable({children}) {
  const {setNodeRef} = useDroppable({
    id: 'unique-id',
  });
  
  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  );
}