import React, { useState } from 'react';
import PropTypes from 'prop-types';

const GeneralSelect = ({ name, data, defaultValue, change }) => {
    const [value, setValue] = useState(defaultValue);

    const onChange = e => {
        setValue(e.currentTarget.value);
        change(name, e.currentTarget.value);
    };

    return (
        <select name={name} value={value} onChange={onChange}>
            { data.map((currentItem, index) => <option key={index} value={currentItem}>{currentItem}</option>) }
        </select>
    );
};

GeneralSelect.propTypes = {
    name: PropTypes.string,
    data: PropTypes.array,
    defaultValue: PropTypes.string,
    change: PropTypes.func
};

export default GeneralSelect;
