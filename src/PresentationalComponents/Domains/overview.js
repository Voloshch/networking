import React from 'react';
import { injectIntl } from 'react-intl';
import { Redirect, withRouter, Switch, Route } from 'react-router-dom';
import DomainDetails from './domainDetails';
import DnsDomains from './domains';
import { Segment } from 'semantic-ui-react';
import TabsLayout from '../../Layouts/tabsLayout';
import { domainsPath, domainPath } from '../../Constants/routes';

const DomainsOverview = () => {
    const menuItems = [
        {
            name: 'DnsDomains',
            path: 'domains',
            component: DnsDomains
        }
    ];

    return <>
        <TabsLayout menuItems={menuItems} />
        <Segment attached='bottom'>
            <Switch>
                <Route exact path={domainsPath()} component={ DnsDomains } />
                <Route exact path={domainPath()} component={ DomainDetails } />
                <Redirect to={`/dns/${menuItems[0].path}`} />
            </Switch>
        </Segment>
    </>;
};

export default injectIntl(withRouter(DomainsOverview));
