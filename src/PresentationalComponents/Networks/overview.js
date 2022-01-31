import React from 'react';
import { injectIntl } from 'react-intl';
import { Redirect, withRouter, Switch, Route } from 'react-router-dom';
import NetworkDetails from '../Details/networkDetails';
import Networks from './networks';
import Routes from '../Routes/routes';
import { Segment } from 'semantic-ui-react';
import TabsLayout from '../../Layouts/tabsLayout';
import { networksPath, networkPath, routesPath } from '../../Constants/routes';

const NetworksOverview = () => {
    const menuItems = [
        {
            name: 'Networks',
            path: 'networks',
            component: Networks
        },
        {
            name: 'Routes',
            path: 'routes',
            component: Routes
        }
    ];

    return <>
        <TabsLayout menuItems={menuItems} />
        <Segment attached='bottom'>
            <Switch>
                <Route exact path={networksPath()} component={ Networks } />
                <Route exact path={networkPath()} component={ NetworkDetails } />
                <Route exact path={routesPath()} component={ Routes } />
                <Redirect to={`/vpc/${menuItems[0].path}`} />
            </Switch>
        </Segment>
    </>;
};

export default injectIntl(withRouter(NetworksOverview));
