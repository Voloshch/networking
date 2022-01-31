import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Grid, Header } from 'semantic-ui-react';

const ItemHeader = ({ title, intl }) => {
    return (
        <Grid.Column verticalAlign='middle' width={4} style={{ marginTop: 25 }}>
            <Header as='h4'>{intl.formatMessage(title)}</Header>
        </Grid.Column>
    );
};

ItemHeader.propTypes = {
    intl: PropTypes.any,
    title: PropTypes.any
};

export default injectIntl(ItemHeader);
