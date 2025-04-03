import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/react';

const PopupModal = ({ isOpen, onOpenChange, header, children, ...rest }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior='inside'
      {...rest}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className='flex flex-col gap-1'>{header}</ModalHeader>
            <ModalBody>{children}</ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PopupModal;
