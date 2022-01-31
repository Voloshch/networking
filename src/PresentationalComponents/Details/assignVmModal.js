import React, { useState, useEffect } from 'react';
import { Modal, Header, Button, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import ReturnVmTable from './returnVmTable';
import { onSearch } from '../../Utilities/search';
import { injectIntl } from 'react-intl';
import messages from '../../Messages';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllVMs } from '../../AppActions';

const AssignVmModal = ({ intl, submitAction }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);
    const [checked, setChecked] = useState({});
    const [disabledList, setDisabledList] = useState({});
    const [checkedCount, setCheckedCount] = useState(0);
    const allVms = useSelector(state => state.ComputeStore.allVms);
    const [nicsBasedVmList, setNicsBasedVmList] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllVMs());
    }, [dispatch]);

    const onChange = (e) => {
        setSearch(e.currentTarget.value);
    };

    const handleClose = () => {
        setChecked({});
        setOpen(false);
    };

    useEffect(() => {
        const nics = [];
        for (let vm of allVms) {
            for (let nic of vm.nics) {
                nics.push({
                    nic: nic.device_name,
                    nicId: nic.uid_ems,
                    service: vm.service?.name,
                    vmName: vm.name,
                    vmId: vm.id,
                    mac: nic.address
                });

                // disable vms which were created but never started
                if (!vm.boot_time) {
                    setDisabledList({ ...disabledList, [nic.uid_ems]: true });
                }
            }
        }

        setNicsBasedVmList(nics);
    }, [allVms]);

    const handleSubmit = () => {
        // eslint-disable-next-line no-unused-vars
        const nicIds = Object.entries(checked).filter(([_nicId, isChecked]) => isChecked).map(([nicId, _isChecked]) => nicId);
        submitAction(nicIds);
        handleClose();
    };

    useEffect(() => {
        setResult(onSearch(nicsBasedVmList, search));
    }, [search, nicsBasedVmList]);

    const toggle = (id) => () => (setChecked({ ...checked, [id]: !checked[id] }));

    useEffect(() => {
        setCheckedCount(Object.values(checked).filter(value => value).length);
    }, [checked]);

    return <React.Fragment>
        <Button onClick={() => setOpen(true)} primary>{intl.formatMessage(messages.assignNic)}</Button>

        <Modal open={open} size="fullscreen">
            <Header content='Assigned VM Network Interfaces' />

            <Modal.Content>
                <Input value={search} onChange={onChange} icon='search' placeholder='Search...' />

                <div className='vm-block'>
                    <ReturnVmTable modal vmInterfaces={result} checked={checked} toggle={toggle} disabledList={disabledList} />
                </div>
                <Modal.Actions align={'right'}>
                    {intl.formatMessage(messages.selected, { count: checkedCount })}
                    <Button onClick={handleClose}>{intl.formatMessage(messages.cancel)}</Button>
                    <Button onClick={handleSubmit} primary type='submit' disabled={!checkedCount} >{intl.formatMessage(messages.save)}</Button>
                </Modal.Actions>
            </Modal.Content>
        </Modal>
    </React.Fragment>;
};

AssignVmModal.propTypes = {
    intl: PropTypes.any,
    // data: PropTypes.string,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitAction: PropTypes.func
};

export default injectIntl(AssignVmModal);
