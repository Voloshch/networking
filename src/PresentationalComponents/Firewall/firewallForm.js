import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, Form, Button } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { required, maxLength30 } from '../../Utilities/Validations';
import GeneralInput from '../../GeneralComponents/generalInput';
import messages from '../../Messages';

const FirewallForm = ({ intl, handleClose, handleSubmit, edit, invalid, pristine }) => {
    const buttonContent = edit ? intl.formatMessage(messages.editSecurityGroup) : intl.formatMessage(messages.createSecurityGroup);
    return <Form>
        <Field
            name='name'
            label={intl.formatMessage(messages.nameSecurityGroups)}
            component={GeneralInput}
            type='text'
            validate={[required, maxLength30]}
        />
        <Modal.Actions align={'right'}>
            <Button onClick={handleClose} content={intl.formatMessage(messages.cancel)} />
            <Button onClick={handleSubmit} primary type='submit' disabled={pristine || invalid} content={buttonContent}/>
        </Modal.Actions>
    </Form>;
};

FirewallForm.propTypes = {
    intl: PropTypes.any,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    edit: PropTypes.bool,
    invalid: PropTypes.any,
    pristine: PropTypes.any
};

export default reduxForm({
    form: 'firewallNetwork'
})(injectIntl(FirewallForm));
