import React from 'react';
import { injectIntl } from 'react-intl';
import { Redirect, withRouter, Switch, Route } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import TabsLayout from '../../Layouts/tabsLayout';
import {
    certificatesPath,
    webRoutesPath,
    createroutePath,
    editroutePath,
    createCertificatePath,
    editCertificatePath,
    certificateDetailsPath,
    detailsPath
} from '../../Constants/routes';
import Certificates from './Certificates';
import WebRoutesDetails from './WebRoutesDetails';
import WebRoutes from './WebRoutes';
import CreateEditSertificate from './CreateEditSertificate';
import CertificateDetails from './CertificateDetails';
import messages from '../../Messages';
import { PropTypes } from 'prop-types';
import CreateEditRoute from './CreateEditRoute';

const LoadBalancerOverview = ({ intl }) => {
    const menuItems = [
        {
            name: intl.formatMessage(messages.webRoutes),
            path: 'web_routes',
            component: WebRoutes
        },
        {
            name: intl.formatMessage(messages.certificates),
            path: 'certificates',
            component: Certificates
        }
    ];

    return <>
        <TabsLayout menuItems={menuItems} />
        <Segment attached='bottom'>
            <Switch>
                <Route exact path={webRoutesPath()} component={ WebRoutes } />
                <Route exact path={createroutePath()} component={ CreateEditRoute } />
                <Route exact path={editroutePath()} component={ CreateEditRoute } />
                <Route exact path={detailsPath()} component={ WebRoutesDetails } />

                <Route exact path={certificatesPath()} component={ Certificates } />
                <Route exact path={createCertificatePath()} component={ CreateEditSertificate } />
                <Route exact path={editCertificatePath()} component={ CreateEditSertificate } />
                <Route exact path={certificateDetailsPath()} component={ CertificateDetails } />
                <Redirect to={`/load_balancer/${menuItems[0].path}`} />
            </Switch>
        </Segment>
    </>;
};

LoadBalancerOverview.propTypes = {
    intl: PropTypes.any
};

export default injectIntl(withRouter(LoadBalancerOverview));
