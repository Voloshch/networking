import React from 'react';
import { Form, Button, Header } from 'semantic-ui-react';
import { Field, reduxForm, reset } from 'redux-form';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import messages from '../../Messages';
import GeneralInput from '../../GeneralComponents/generalInput';
import ItemHeader from '../../GeneralComponents/itemHeader';
import { required, hostname, maxLength250 } from '../../Utilities/Validations';
import { useSelector } from 'react-redux';

const afterSubmit = (_formValues, dispatch) => {
    dispatch(reset('addDomain'));
};

const AddDomain = ({ onTop, intl, handleSubmit }) => {
    const user = useSelector(state => state.ComputeStore.user);

    return user.role === 'admin' && <>
        {onTop ? <ItemHeader title={messages.addDomain} /> : <Header className="center">{intl.formatMessage(messages.noDomains)}</Header>}

        <Form onSubmit={handleSubmit}>
            <div className={`flex add-domain-form ${onTop ? '' : 'flex-center'}`}>
                <Field
                    name='name'
                    label={intl.formatMessage(messages.enterDomainName)}
                    component={GeneralInput}
                    type='text'
                    validate={[required, hostname, maxLength250] }
                />
                <Button className="btn-add-domain" primary type='submit'>
                    {intl.formatMessage(messages.addDomain)}
                </Button>
            </div>
        </Form>
    </> || null;
};

AddDomain.propTypes = {
    onTop: PropTypes.bool,
    intl: PropTypes.any
};

export default reduxForm({
    form: 'addDomain',
    onSubmitSuccess: afterSubmit
})(injectIntl(AddDomain));
