import React, { useState } from 'react';
import { Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { ports, dnsOrEmpty, ipv6OrEmpty } from '../../Utilities/Validations';
import GroupSelect from './groupSelect';
import GeneralSelect from './generalSelect';
import GroupInput from './groupInput';
import { injectIntl } from 'react-intl';
import messages from '../../Messages';

const FormRule = ({ intl, handleClose, handleSubmit, initial, groups, traffics, protocols, ipType }) => {
    const [disableFields, setDisableFields] = useState({
        port: true,
        remoteIpSubnet: false,
        group: false
    });
    const [values, setValues] = useState(initial);
    const remoteIpSubnetPlaceholderValue = values.ipType === 'IPV6' ?
        intl.formatMessage(messages.any, { value: ' (::/0)' }) :
        intl.formatMessage(messages.any, { value: ' (0.0.0.0/0)' });

    const onSubmit = () => {
        handleSubmit(values);
    };

    const onClose = () => {
        handleClose();
    };

    const handleChange = (name, value) => {
        /* eslint-disable */
        switch (name) {
            case 'protocol':
                if (value === 'ICMP') {
                    setValues({ ...values, port: '', [name]: value });
                    setDisableFields({ ...disableFields, port: true });
                } else if (value === 'Any') {
                    setValues({ ...values, port: '', [name]: value });
                    setDisableFields({ ...disableFields, port: true });
                } else {
                    setValues({ ...values, [name]: value });
                    setDisableFields({ ...disableFields, port: false });
                }
                break;
            case 'group':
                if (value !== '') {
                    setValues({ ...values, [name]: value });
                    setDisableFields({ ...disableFields, remoteIpSubnet: true })
                } else {
                    setValues({ ...values, [name]: value });
                    setDisableFields({ ...disableFields, remoteIpSubnet: false })
                }
                break;
            case 'ip':
                if (value !== '') {
                    setValues({ ...values, [name]: value });
                    setDisableFields({ ...disableFields, group: true });
                } else {
                    setValues({ ...values, [name]: value });
                    setDisableFields({ ...disableFields, group: false });
                }
                break;
            default:
                setValues({ ...values, [name]: value });
        }
        /* eslint-enable */
    };

    return (
        <>
            <Table.Row className='rule-form'>
                <Table.Cell>
                    <GeneralSelect
                        name='traffic'
                        data={traffics}
                        change={handleChange}
                        defaultValue={values.traffic}
                    />
                </Table.Cell>
                <Table.Cell>
                    <GeneralSelect
                        name='ipType'
                        data={ipType}
                        change={handleChange}
                        defaultValue={values.ipType}
                    />
                </Table.Cell>
                <Table.Cell>
                    <GroupInput
                        name='port'
                        type='text'
                        change={handleChange}
                        defaultValue={values.port}
                        placeholderValue='0-65535'
                        validate={ports}
                        isDisabled={disableFields.port}
                    />
                </Table.Cell>
                <Table.Cell>
                    <GeneralSelect
                        name='protocol'
                        data={protocols}
                        change={handleChange}
                        defaultValue={values.protocol}
                    />
                </Table.Cell>
                <Table.Cell>
                    <GroupSelect
                        name='group'
                        groups={groups}
                        change={handleChange}
                        defaultValue={values.group === null ? '' : values.group}
                        isDisabled={disableFields.group}
                    />
                </Table.Cell>
                <Table.Cell>
                    <GroupInput
                        name='ip'
                        type='text'
                        change={handleChange}
                        defaultValue={values.ip}
                        placeholderValue={remoteIpSubnetPlaceholderValue}
                        validate={values.ipType === 'IPV6' ? ipv6OrEmpty : dnsOrEmpty}
                        isDisabled={disableFields.remoteIpSubnet}
                    />
                </Table.Cell>
                <Table.Cell collapsing textAlign='right'>
                    <Icon name='check' onClick={onSubmit} disabled={values.port === null || values.ip === null} />
                    <Icon name='close' className='rule-button' onClick={onClose} />
                </Table.Cell>
            </Table.Row>
        </>
    );
};

FormRule.propTypes = {
    intl: PropTypes.any,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    initial: PropTypes.object,
    groups: PropTypes.array,
    traffics: PropTypes.array,
    protocols: PropTypes.array,
    ipType: PropTypes.array
};

export default injectIntl(FormRule);
