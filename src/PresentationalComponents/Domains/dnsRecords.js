import React, { useEffect } from 'react';
// import { Header, Tab } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
// import messages from '../../Messages';
import PropTypes from 'prop-types';
// import { dnsFields } from '../../AppConstants';
// import CreateDnsForm from './createDnsForm';
import { useSelector, useDispatch } from 'react-redux';

// const dnsTypeFields = {
//     A: dnsFields.ipv4,
//     AAAA: dnsFields.ipv6,
//     TXT: dnsFields.text,
//     SRV: dnsFields.priority,
//     MX: dnsFields.priority,
//     CNAME: dnsFields.hostname,
//     NS: dnsFields.hostname
// };

/* eslint-disable */
const DnsRecords = ({ intl, id }) => {
    const dnsRecords = useSelector(state => state.ComputeStore.dnsRecords);
    const dispatch = useDispatch();
    // console.log('viktoryia dns records', dnsRecords);

    // useEffect(() => {
    //     console.log('viktoryia id', id);
    // } ,[dispatch, id])

    // const onAddDns = (dnsType) => (fields) => {
    //     console.log('viktoryia fields', dnsType, fields);
    // }

    // const renderTab = (dnsType, fieldType) => {
    //     const showIpOrHostname = fieldType === dnsFields.priority;
    //     const defaultValue = fieldType === dnsFields.priority ? 10 : undefined;
    //     const description = intl.formatMessage(messages[`dnsDesc${dnsType}`]);

    //     return () => <CreateDnsForm type={fieldType} ipOrHostname={showIpOrHostname} onSubmit={onAddDns(dnsType)} description={description} defaultValue={defaultValue} />
    // }

    // const getPanes = () => {
    //     return Object.entries(dnsTypeFields).map(([key, field]) => ({ menuItem: key, render: renderTab(key, field) }))
    // }

    return dnsRecords.map(record => (
        <p>{record.name}</p>
    ));
};

DnsRecords.propTypes = {
    intl: PropTypes.any
};

export default injectIntl(DnsRecords);
