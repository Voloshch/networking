import React from 'react';
import { injectIntl } from 'react-intl';
import { Redirect, withRouter, Switch, Route } from 'react-router-dom';
import FirewallDetails from '../Details/firewallDetails';
import Firewall from './firewall';
import { Segment } from 'semantic-ui-react';
import TabsLayout from '../../Layouts/tabsLayout';
import { groupsPath, groupPath } from '../../Constants/routes';

const FirewallOverview = () => {
    const menuItems = [
        {
            name: 'Firewall',
            path: 'groups',
            component: Firewall
        }
    ];

    return <>
        <TabsLayout menuItems={menuItems} />
        <Segment attached='bottom'>
            <Switch>
                <Route exact path={groupsPath()} component={ Firewall } />
                <Route exact path={groupPath()} component={ FirewallDetails } />
                <Redirect to={`/firewall/${menuItems[0].path}`} />
            </Switch>
        </Segment>
    </>;
};

export default injectIntl(withRouter(FirewallOverview));
