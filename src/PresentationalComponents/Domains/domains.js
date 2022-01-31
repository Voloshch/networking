import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ContentPage from '../../GeneralComponents/contentPage';
import DomainsList from './domainsList';
import { fetchDnsZones, createAndFetchDnsZone } from '../../AppActions';
import messages from '../../Messages';
import AddDomain from './addDomain';

const DnsDomains = () => {
    const dnsZones = useSelector(state => state.ComputeStore.dnsZones);
    const dnsZonesFetchStatus = useSelector(state => state.ComputeStore.dnsZonesFetchStatus);
    const user = useSelector(state => state.ComputeStore.user);
    const token = useSelector(state => state.ComputeStore.token);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDnsZones());
    }, [dispatch, user, token]);

    const onAddDomain = (fields) => {
        dispatch(createAndFetchDnsZone({
            name: fields.name,
            metadata: {
                // service: true,
                account: user.account,
                owner: user.email
            }
        }));
    };

    return (
        <>
            {!!dnsZones?.length && <AddDomain onTop onSubmit={onAddDomain} />}
            <ContentPage
                status={dnsZonesFetchStatus}
                pageData={dnsZones}
                title={messages.domains}
                componentDataList={DomainsList}
                noContentComponent={AddDomain}
                noContentComponentProps={{ onSubmit: onAddDomain }}
            />
        </>
    );
};

export default DnsDomains;
