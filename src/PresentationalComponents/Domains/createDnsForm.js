import React, { useEffect } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Field, reduxForm, change, reset } from 'redux-form';
import { injectIntl } from 'react-intl';
import GeneralInput from '../../GeneralComponents/generalInput';
import { required, ip, ipv6, ttl, priority, port, hostname, targetHostname, maxLength63 } from '../../Utilities/Validations';
import messages from '../../Messages';
import PropTypes from 'prop-types';
import { dnsFields } from '../../AppConstants';
import { useDispatch } from 'react-redux';

const afterSubmit = (_formValues, dispatch) => {
    dispatch(reset('createDnsZoneRecord'));
};

const CreateDnsForm = ({ type,
    intl,
    pristine,
    invalid,
    handleSubmit,
    dnsType,
    description,
    placeholderMessage,
    defaultValue }) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(change('createDnsZoneRecord', type, defaultValue));
    }, [dispatch, type, defaultValue]);

    const validationRules = {
        [dnsFields.name]: [required],
        [dnsFields.ipv4]: [required, ip],
        [dnsFields.ipv6]: [required, ipv6],
        [dnsFields.ttl]: [required, ttl],
        [dnsFields.text]: [required],
        [dnsFields.priority]: [priority],
        [dnsFields.port]: [required, port],
        [dnsFields.hostname]: [required, hostname],
        [dnsFields.targetHostname]: [required, targetHostname],
        [dnsFields.weight]: [port]
    };

    const fields = {
        nameField: <Field
            name="name"
            type="text"
            component={GeneralInput}
            label={intl.formatMessage(messages.name)}
            props={type === 'text' ? { style: { width: '30.2rem' } } : {}}
            placeholder={dnsType === 'SRV' ?
                intl.formatMessage(messages.dnsFormSrvNamePlaceholder) :
                intl.formatMessage(messages.dnsFormNamePlaceholder)}
            validate={[...validationRules.name, maxLength63]}
            dnsType={dnsType}
        />,
        targetHostnameField: <Field
            name="targetHostname"
            type="text"
            component={GeneralInput}
            label={intl.formatMessage(messages.targetHostname)}
            placeholder={intl.formatMessage(messages.dnsFormTargetHostnamePlaceholder)}
            validate={[...validationRules.targetHostname]}
        />,
        mailServerHostnameOrIpField:
            <Field
                name="mailServerHostnameOrIp"
                type="text"
                component={GeneralInput}
                label={intl.formatMessage(messages.mailServerHostnameOrIp)}
                placeholder={intl.formatMessage(messages.dnsMailServerHostnameOrIpPlaceholder)}
                validate={[...validationRules.targetHostname]}
            />,
        portField:
            <Field
                name="port"
                type="number"
                component={GeneralInput}
                label={intl.formatMessage(messages.port)}
                placeholder='0-65535'
                validate={[...validationRules.port]}
            />,
        typeField:
            <Field
                name={type}
                type="number"
                props={type === 'text' ? { style: { width: '45.7rem' } } : {}}
                component={GeneralInput}
                label={intl.formatMessage(messages[type])}
                placeholder={placeholderMessage}
                validate={[...validationRules[type]]}
            />,
        weightField:
            <Field
                name="weight"
                type="number"
                component={GeneralInput}
                label={intl.formatMessage(messages.weight)}
                placeholder='0-65535'
                validate={[...validationRules.weight]}
            />,
        ttlField:
            <Field
                name="ttl"
                type="number"
                component={GeneralInput}
                label={intl.formatMessage(messages.ttl)}
                placeholder={intl.formatMessage(messages.dnsFormTtlPlaceholder)}
                validate={[required, ...validationRules.ttl]}
            />,
        submitButton:
            <Button className="btn-add-dns" primary type='submit' disabled={pristine || invalid}>
                {intl.formatMessage(messages.add)}
            </Button>
    };

    const { nameField,
        targetHostnameField,
        mailServerHostnameOrIpField,
        portField,
        typeField,
        weightField,
        ttlField,
        submitButton } = fields;

    const uniqueTabFields = {
        TXT: [[nameField, ttlField], [typeField, submitButton]],
        SRV: [[nameField, targetHostnameField, portField], [typeField, weightField, ttlField, submitButton]],
        MX: [nameField, mailServerHostnameOrIpField, typeField, ttlField, submitButton]
    };

    return <>
        <p className="color--grey">{description}</p>

        <Form
            className="flex create-dns-form"
            onSubmit={handleSubmit}
        >
            <div className='flex' style={{ flexDirection: 'column' }}>
                {
                    uniqueTabFields[dnsType] ?
                        Array.isArray(uniqueTabFields[dnsType][0]) ?
                            uniqueTabFields[dnsType].map((item, key) => <div key={key} className='flex'>{item}</div>) :
                            <div className='flex'>{uniqueTabFields[dnsType]}</div> :
                        <div className='flex'>{[nameField, typeField, ttlField, submitButton]}</div>
                }
            </div>
        </Form>
    </>;
};

CreateDnsForm.propTypes = {
    intl: PropTypes.any,
    invalid: PropTypes.any,
    pristine: PropTypes.any,
    type: PropTypes.string,
    dnsType: PropTypes.string,
    handleSubmit: PropTypes.func,
    description: PropTypes.string,
    placeholderMessage: PropTypes.any,
    defaultValue: PropTypes.number
};

export default reduxForm({
    form: 'createDnsZoneRecord',
    onSubmitSuccess: afterSubmit
})(injectIntl(CreateDnsForm));
