import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const AssignedVMForm = ({ handleClose, handleSubmit }) => {
    const countVM = 3;
    return (
        <Form>
            <Modal.Actions align={'right'}>
                <span>{countVM} selected</span>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} primary type='submit'>Save</Button>
            </Modal.Actions>
        </Form>
    );
};

AssignedVMForm.propTypes = {
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func
};

export default AssignedVMForm;
