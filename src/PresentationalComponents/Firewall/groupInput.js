import React, { useState } from 'react';
import PropTypes from 'prop-types';

const GroupInput = ({ name, placeholderValue, defaultValue, change, validate, isDisabled }) => {
    const [isError, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (validate(value)) {
            change(name, null);
            setErrorMessage(validate(value));
            setError(true);
        } else {
            change(name, value);
            setErrorMessage('');
            setError(false);
        }
    };

    let divClass = (isError ? 'error' : '') + ' field';

    return (
        <div className={divClass} style={{ position: 'relative', width: 'max-content' }}>
            <label></label>
            <input
                disabled={isDisabled}
                name={name}
                value={defaultValue}
                onChange={(event) => handleChange(event)}
                placeholder={placeholderValue}
                type='text'
                style={isDisabled ? { backgroundColor: '#F8F8F8', width: '9em' } : { width: '9em' }}
            />
            {isError &&
                <div className='ui pointing basic red label'>{errorMessage}</div>}
        </div>
    );
};

GroupInput.propTypes = {
    name: PropTypes.string,
    defaultValue: PropTypes.string,
    placeholderValue: PropTypes.string,
    change: PropTypes.func,
    validate: PropTypes.func,
    isDisabled: PropTypes.bool
};

export default GroupInput;
