
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSecurityGroups } from '../../AppActions';
import ContentPage from '../../GeneralComponents/contentPage';
import messages from '../../Messages';
import FirewallModal from './firewallModal';
import firewallLists from './firewallsList';

const Firewall = () => {
    const groups = useSelector(state => state.ComputeStore.groups);
    const groupsFetchStatus = useSelector(state => state.ComputeStore.groupsFetchStatus);
    const user = useSelector(state => state.ComputeStore.user);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSecurityGroups());
    }, [dispatch, user]
    );

    return (
        <ContentPage status={groupsFetchStatus} pageData={groups} title={messages.securityGroup}
            componentDataList={firewallLists} componentModal={FirewallModal} noContentMessage={messages.noSecurityGroup}
        />
    );
};

export default Firewall;
