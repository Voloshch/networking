import React from 'react';
import { Header, Tab } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import messages from '../../Messages';
import PropTypes from 'prop-types';
import { dnsFields } from '../../AppConstants';
import CreateDnsForm from './createDnsForm';
import { useSelector, useDispatch } from 'react-redux';
import { createAndFetchDnsZoneRecord } from '../../AppActions';
import { useParams } from 'react-router-dom';

const dnsTypeFields = {
    A: dnsFields.ipv4,
    AAAA: dnsFields.ipv6,
    CNAME: dnsFields.hostname,
    TXT: dnsFields.text,
    SRV: dnsFields.priority,
    MX: dnsFields.priority,
    NS: dnsFields.hostname
};

const CreateDns = ({ intl }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.ComputeStore.user);
    const { zoneName } = useParams();

    const pattern = (data, fields) => ({
        A: () => {
            data.data = fields.ipv4;
        },
        AAAA: () => {
            data.data = fields.ipv6;
        },
        TXT: () => {
            data.data = fields.text;
            data.host = '';
        },
        SRV: () => {
            data.data = fields.targetHostname;
            data.port = fields.port;
            data.weight = fields.weight;
            data.priority = fields.priority;
        },
        MX: () => {
            data.data = fields.mailServerHostnameOrIp;
            data.priority = fields.priority;
        },
        CNAME: () => {
            data.data = fields.hostname;
        },
        NS: () => {
            data.data = fields.hostname;
        }
    });

    const handleSubmit = (dnsType) => (fields) => {
        //Define the format of the payload data
        let payloadData = {
            name: dnsType === 'NS' ? `${fields.name}.ns.dns` : fields.name,
            ttl: +fields.ttl,
            type: dnsType,
            metadata: {
                account: user.account,
                owner: user.email
            }
        };

        pattern(payloadData, fields)[dnsType]();

        dispatch(createAndFetchDnsZoneRecord(zoneName, payloadData));
    };

    const renderTab = (dnsType, fieldType) => {
        // const showSrvFields = dnsType === 'SRV';
        // const showMailServerHostnameOrIp = dnsType === 'MX';
        const defaultValue = fieldType === 'priority' ? 10 : undefined;
        const description = intl.formatMessage(messages[`dnsDesc${dnsType}`], { tag: <br /> });

        const setPlaceholderMessage = () => {
            /* eslint-disable */
            switch (fieldType) {
                case 'priority':
                    return intl.formatMessage(messages.dnsFormPriorityPlaceholder);
                case 'hostname':
                    return intl.formatMessage(messages.dnsFormHostnamePlaceholder);
                case 'ipv6':
                    return intl.formatMessage(messages.dnsFormIpPlaceholder, { ipType: '20e8:fa::1' });
                case 'ipv4':
                    return intl.formatMessage(messages.dnsFormIpPlaceholder, { ipType: '10.0.0.1' });
                case 'text':
                    return intl.formatMessage(messages.dnsFormTextPlaceholder);
            }
            /* eslint-enable */
        };

        // eslint-disable-next-line max-len, react/display-name
        return () => <CreateDnsForm
            dnsType={dnsType}
            type={fieldType}
            onSubmit={handleSubmit(dnsType)}
            description={description}
            defaultValue={defaultValue}
            placeholderMessage={setPlaceholderMessage()}
        />;
    };

    //Display the DNS fields
    const getPanes = () => {
        return Object.entries(dnsTypeFields).map(([key, field]) => ({ menuItem: key, render: renderTab(key, field) }));
    };

    return <div className="create-dns">
        <Header className='create-dns--header' as='h4'>{intl.formatMessage(messages.createDnsRecord)}</Header>
        <Tab menu={{ secondary: true, pointing: true }} panes={getPanes()} />
    </div>;
};

CreateDns.propTypes = {
    intl: PropTypes.any
};

export default injectIntl(CreateDns);
