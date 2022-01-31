import React from 'react';
// import { Modal, Header, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
// import AssignedVMForm from './assignedVMForm';

const AssignedVMModal = ({ count }) => {
    // const [open, setOpen] = useState(false);

    // const handleClose = useCallback(
    //     () => {
    //         setOpen(false);
    //     },
    //     [setOpen]
    // );

    // const onSubmit = useCallback(
    //     () => {
    //         handleClose();
    //     },
    //     [handleClose, count]
    // );

    return  <>
        {/* {
            count || count === 0 ? <button className="reset-button assing-vm" onClick={() => setOpen(true)}>{count}</button> :
                <Button onClick={() => setOpen(true)} primary content="Assign VM"/>
        }
        <Modal open={open} size="tiny">
            <Header content={'Select multiple VMs to assing'} />
            <Modal.Content>
                <AssignedVMForm handleClose={handleClose} onSubmit={onSubmit} />
            </Modal.Content>
        </Modal> */}
        { count }
    </>;
};

AssignedVMModal.propTypes = {
    count: PropTypes.number
};

export default AssignedVMModal;
