import React from 'react';
import './DeleteConfirmation.css'; // You can style it with custom CSS

const DeleteConfirmation = ({ onConfirm, onCancel }) => {
    return (
        <div className="delete-confirmation">
            <p>Are you sure you want to delete?</p>
            <button onClick={onConfirm}>Yes</button>
            <button onClick={onCancel}>No</button>
        </div>
    );
}

export default DeleteConfirmation;
