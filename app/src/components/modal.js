import React, { useState } from "react";
import FontAwesome from 'react-fontawesome'

import "./modal.scss";

export const Modal = (props) => {
    const { children, width = "650px", displayModal = false, handleClose } = props;

    return (
        <>
            {displayModal ? (
                <>
                    <div
                        className="modal__overlay"
                    ></div>
                    <div className="modal__content" style={{ maxWidth: width }}>
                        <div className="modal__content__head">
                            <button
                                className="modal__button-close"
                                onClick={() => handleClose(false)}
                            >
                                <FontAwesome
                                    size="lg"
                                    name="close"
                                />
                            </button>
                        </div>
                        <div className="modal__content__body">{children}</div>
                    </div>
                </>
            ) : null}
        </>
    );
};

export const ValidModal = (props) => {
    const { question, width = "650px", displayModal = false, onConfirm, label, className = "button--secondary" } = props;

    const [showModal, SetShowModal] = useState(displayModal);

    function handleConfirm() {
        onConfirm && onConfirm();
        SetShowModal(false);
    }

    return (
        <>
            <button className={className} onClick={() => SetShowModal(true)}>
                {label}
            </button>
            {showModal ? (
                <>
                    <div
                        className="modal__overlay"
                    ></div>
                    <div className="modal__content" style={{ maxWidth: width }}>
                        <div className="modal__content__head">
                            <button
                                className="modal__button-close"
                                onClick={() => SetShowModal(false)}
                            >
                                <FontAwesome
                                    name="close"
                                />
                            </button>
                        </div>
                        <div className="modal__content__body modal__content__body--valid-modal">
                            <span className="modal__content__question">{question}</span>
                            <div className="modal__content__action">
                                <button className="modal__content__btn-confirm button--secondary btn-bg--red" onClick={() => SetShowModal(false)}>Annuler</button>
                                <button className="modal__content__btn-cancel button--secondary btn-bg--green" onClick={handleConfirm}>Confirmer</button>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    )
}

export default Modal;