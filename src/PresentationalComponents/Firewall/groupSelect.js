import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import messages from '../../Messages';

const GroupSelect = ({ name, groups, defaultValue, change, intl, isDisabled }) => {
    const [value, setValue] = useState(defaultValue);

    const onChange = e => {
        setValue(e.currentTarget.value);
        change(name, e.currentTarget.value);
    };

    return (
        <select name={name}
            value={value}
            onChange={onChange}
            disabled={isDisabled}
            style={isDisabled ? { backgroundColor: '#F8F8F8' } : {}}
        >
            <option value=''>{intl.formatMessage(messages.any, { value: '' })}</option>
            {groups.map((currentGroup, index) => currentGroup.name &&
                <option key={index} value={currentGroup.ems_ref}>{currentGroup.name}</option>)}
        </select>
    );
};

GroupSelect.propTypes = {
    name: PropTypes.string,
    groups: PropTypes.array,
    defaultValue: PropTypes.string,
    change: PropTypes.func,
    intl: PropTypes.any,
    isDisabled: PropTypes.bool
};

export default injectIntl(GroupSelect);
