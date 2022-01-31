import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ContentPage from '../../GeneralComponents/contentPage';
import NetworksList from '../Networks/networksList';
import NetworkModal from '../Networks/networkModal';
import { fetchNetworks, fetchVMs, fetchProvider } from '../../AppActions';
import messages from '../../Messages';

const Networks = () => {
    const networks = useSelector(state => state.ComputeStore.networks);
    const vms = useSelector(state => state.ComputeStore.assignedVms);
    const vmsFetchStatus = useSelector(state => state.ComputeStore.assignedVmsFetchStatus);
    const user = useSelector(state => state.ComputeStore.user);

    const dispatch = useDispatch();
    useEffect(() => {
        if (!user.account || !user.role) return;    // eslint-disable-line curly
        dispatch(fetchNetworks());
        dispatch(fetchVMs());
        dispatch(fetchProvider());
    }, [dispatch, user]);

    return (
        <ContentPage status={vmsFetchStatus} pageData={networks.length ? [vms, networks] : []} title={messages.vpcNetworks}
            componentDataList={NetworksList} componentModal={NetworkModal} noContentMessage={messages.noNetworks}
        />
    );
};

export default Networks;
