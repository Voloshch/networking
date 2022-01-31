import React from 'react';
import { injectIntl } from 'react-intl';
import { useParams } from 'react-router';
import { Grid, Header } from 'semantic-ui-react';
import { detailsPath, webRoutesPath } from '../../Constants/routes';
import ButtonBack from '../../GeneralComponents/buttonBack';
import { PropTypes } from 'prop-types';
import messages from '../../Messages';
import CreateEditForm from './CreateEditForm';

const CreateEditRoute = ({ intl }) => {
    const { menuGroup, id } = useParams();

    return <>
        <ButtonBack path={id ? detailsPath(menuGroup, id) : webRoutesPath(menuGroup)} />
        <Grid>
            <Grid.Row style={{ padding: '16px' }}>
                <Header as='h2' style={{ margin: '0 0 10px 0px' }}>
                    {id ? intl.formatMessage(messages.editRoute) : intl.formatMessage(messages.createRoute)}
                </Header>
            </Grid.Row>
        </Grid>
        <CreateEditForm />
    </>;
};

CreateEditRoute.propTypes = {
    intl: PropTypes.any
};

export default injectIntl(CreateEditRoute);
