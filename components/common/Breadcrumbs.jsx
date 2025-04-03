import { ChevronRightIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';

const Breadcrumbs = ({ items, onAction }) => {
  const [breadcrumbItems, setBreadcrumbItems] = useState(items);

  useEffect(() => {
    const updatedItems = [...items];
    if (updatedItems.length > 0) {
      updatedItems.forEach((item, index) => {
        item.active = index === updatedItems.length - 1;
      });

      setBreadcrumbItems(updatedItems);
    }
  }, [items]);

  const handleItemClick = (clickedIndex, parentId) => {
    if (parentId) {
      const updatedItems = breadcrumbItems.slice(0, clickedIndex + 1);
      updatedItems[clickedIndex].active = true;
      setBreadcrumbItems(updatedItems);
      if (onAction) {
        onAction(parentId);
      }
    }
  };

  return (
    <nav aria-label='Breadcrumb'>
      <ol className='flex space-x-2'>
        {breadcrumbItems.map((item, index) => (
          <li
            key={index}
            className='flex items-center'>
            <button
              className={`${
                item.active ? 'text-orange-500' : 'text-gray-400'
              } hover:text-orange-500 focus:outline-none`}
              onClick={() => handleItemClick(index, Number(item.parentId))}
              disabled={!handleItemClick}>
              {item.label}
            </button>
            {index < breadcrumbItems.length - 1 && (
              <ChevronRightIcon className='ml-2 h-4 w-4 text-gray-400' />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
