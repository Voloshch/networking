import React from 'react';

import { Dropdown, Form } from 'semantic-ui-react';
import { PropTypes } from 'prop-types';

const GeneralDropdown = ({ input, label, options, placeholder, style }) => {

    return (
        <Form.Field style={{ margin: '20px 0px 0px 0px' }}>
            <label>{label}</label>
            <Dropdown selection {...input}
                value={input.value}
                onChange={(param, data) => input.onChange(data.value)}
                placeholder={placeholder}
                options={options}
                style={style}
                fluid
            />
        </Form.Field>
    );
};

GeneralDropdown.propTypes = {
    input: PropTypes.object,
    label: PropTypes.string,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    style: PropTypes.any
};

export default GeneralDropdown;
