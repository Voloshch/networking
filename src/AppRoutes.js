import { Redirect, Route, Switch } from 'react-router-dom';
import React from 'react';
const DomainsOverview = React.lazy(() => import('./PresentationalComponents/Domains/overview'));
const FirewallOverview = React.lazy(() => import('./PresentationalComponents/Firewall/overview'));
const NetworksOverview = React.lazy(() => import('./PresentationalComponents/Networks/overview'));
const LoadBalancerOverview = React.lazy(() => import('./PresentationalComponents/LoadBalancer/overview'));

export const paths = [
    {
        title: 'Vpc',
        to: '/vpc',
        component: NetworksOverview
    },
    {
        title: 'Firewall',
        to: '/firewall',
        component: FirewallOverview
    },
    {
        title: 'Domains',
        to: '/dns',
        component: DomainsOverview
    },
    {
        title: 'Load Balancer',
        to: '/load_balancer',
        component: LoadBalancerOverview
    }
];

export const AppRoutes = () => (
    <Switch>
        { paths.map((path) => <Route key={path.title} path={path.to} component={path.component} />) }
        <Redirect to={paths[0].to} />
    </Switch>
);
