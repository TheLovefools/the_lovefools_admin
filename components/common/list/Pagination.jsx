import React, { useMemo } from 'react';
import { Pagination as NUIPagination } from '@nextui-org/react';
import { numberWithCommas } from '@/utils/utils';

const Pagination = ({ meta, total = 0, handlePageChange }) => {
  const { page = 1, size = 10 } = meta;

  const startRecord = useMemo(() => {
    return Math.min((page - 1) * size + 1, total);
  }, [page, size, total]);

  const endRecord = useMemo(() => {
    return Math.min(page * size, total);
  }, [page, size, total]);

  const totalPages = useMemo(() => {
    return Math.ceil(total / size);
  }, [total, size]);

  const handlePageNumberChange = (pageNumber) => {
    if (pageNumber !== page) {
      handlePageChange(pageNumber);
    }
  };

  if (total === 0) {
    // If there are no records, return null or display appropriate message
    return null; // Or render a message like 'No records found'
  }

  return (
    <div className='flex items-center justify-between px-2 py-2'>
      <span className='text-lg text-small'>
        <p>{`${startRecord} - ${endRecord} of ${numberWithCommas(
          total,
        )} records`}</p>
      </span>
      <div className='flex items-center text-small text-default-400'>
        <NUIPagination
          showShadow
          initialPage={page}
          showControls
          color='primary'
          total={totalPages || 0}
          variant='light'
          onChange={handlePageNumberChange}
        />
      </div>
    </div>
  );
};

export default Pagination;
