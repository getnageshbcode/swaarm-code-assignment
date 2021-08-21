import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
interface IModalExampleOprops {
    buttonLabel?: string;
    className?: string;
    modalBody: string | JSX.Element;
    modalFooter?: string | JSX.Element;
    isOpen: boolean;
    onHide: () => void;
    modalTitle?: string | JSX.Element;
}
const RenderModal = (props: IModalExampleOprops) => {
    const {
        isOpen,
        onHide,
        modalTitle,
        modalBody,
        modalFooter,
        className
    } = props;

    return (
        <Modal isOpen={isOpen} className={className? className:""}>
            <ModalHeader toggle={onHide}>{modalTitle}</ModalHeader>
            <ModalBody>
                {modalBody}
            </ModalBody>
            <ModalFooter>
                {modalFooter}
            </ModalFooter>
        </Modal>
    );
}

export default RenderModal;