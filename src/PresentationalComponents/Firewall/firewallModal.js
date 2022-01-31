import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Header, Button, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import FirewallForm from './firewallForm';
import messages from '../../Messages';
import { createSecurityGroupActionAndFetch, addTemporarySecurityGroup } from '../../AppActions';

const FirewallModal = ({ edit, group, noText, classNameDrop, intl }) => {
    const [open, setOpen] = useState(false);
    const providerId = useSelector(state => state.ComputeStore.providerId);
    const dispatch = useDispatch();
    const user = useSelector(state => state.ComputeStore.user);

    const mapPropsToFire = (item) => { return { action: 'create', name: `${user.location}_${user.account}_${item.name}` };};

    const mapPropsToFireEdit = (item) => { return { action: 'edit', id: group.ems_id, name: item.name };};

    const mapFireToProps = (item) => { return { name: item.name };};

    const handleClose = useCallback(
        () => {
            setOpen(false);
        },
        [setOpen]
    );

    /* eslint camelcase: 0 */
    const mapPropsToSecurityGroupObj = (values) => {
        return {
            name: values.name,
            firewall_rules: [],
            assigned_vms: [],
            isLoading: true
        };
    };

    const createSecurityGroup = (values, providerId) => {
        dispatch(createSecurityGroupActionAndFetch(mapPropsToFire(values), providerId));
        dispatch(addTemporarySecurityGroup(mapPropsToSecurityGroupObj(values)));
    };

    const onSubmit = useCallback(
        (values) => {
            handleClose();
            edit ?
                dispatch(createSecurityGroupActionAndFetch(mapPropsToFireEdit(values), providerId)) :
                createSecurityGroup(values, providerId);
        },
        [handleClose, providerId, dispatch, mapPropsToFire]
    );

    const textButton = !noText && intl.formatMessage(messages.editSecurityGroup);
    const dropDownClass = classNameDrop || '';
    const button =   edit ?
        <Dropdown.Item className={dropDownClass} text={textButton} onClick={() => setOpen(true)} /> :
        <Button onClick={() => setOpen(true)} primary>{intl.formatMessage(messages.createSecurityGroup)}</Button>;

    const content =  edit ?
        <FirewallForm handleClose={handleClose} onSubmit={onSubmit} initialValues={mapFireToProps(group)} edit/> :
        <FirewallForm handleClose={handleClose} onSubmit={onSubmit}/>;

    const headerContent = edit ? intl.formatMessage(messages.editSecurityGroup) : intl.formatMessage(messages.createSecurityGroup);

    return user.role === 'admin' && <>
        { button }
        <Modal open={open} size="tiny" onSubmit={onSubmit} onClose={handleClose} closeIcon>
            <Header
                content={headerContent}
                onClick={handleClose}
            />
            <Modal.Content>{ content }</Modal.Content>
        </Modal>
    </>;
};

FirewallModal.propTypes = {
    edit: PropTypes.bool,
    group: PropTypes.any,
    noText: PropTypes.any,
    classNameDrop: PropTypes.string,
    intl: PropTypes.any
};

export default injectIntl(FirewallModal);
