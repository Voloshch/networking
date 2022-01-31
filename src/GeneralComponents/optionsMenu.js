/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import NetworkModal from '../PresentationalComponents/Networks/networkModal';
import DeleteModal from './deleteModal';
import FirewallModal from '../PresentationalComponents/Firewall/firewallModal';
import RouteModal from '../PresentationalComponents/Routes/routeModal';
import messages from '../Messages';
import { certificateDetailsPath, networkPath, detailsPath } from '../Constants/routes';
import { Link, useParams } from 'react-router-dom';

const OptionsMenu = ({ type, instance, options, intl }) => {
    const { menuGroup } = useParams();
    const actions = {
        networks: {
            edit: (network, key) => <NetworkModal key={key} edit network={network} />,
            view: (network, key) => <Link key={key} role='option' className='item' to={networkPath(network.id, menuGroup)}>
                {/* TODO: onclick action */}
                <Dropdown.Item text={intl.formatMessage(messages.viewVmNics)} onClick={() => { }} />
            </Link>,
            delete: (network, key) => <DeleteModal key={key} type={type} instance={network} />
        },
        firewalls: {
            edit: (group, key) => <FirewallModal key={key} textButton='Exit' edit group={group} />,
            delete: (group, key) => <DeleteModal key={key} type={type} instance={group} />
        },
        routes: {
            edit: (route, key) => <RouteModal key={key} edit route={route} />,
            delete: (route, key) => <DeleteModal key={key} type={type} instance={route} />
        },
        domains: {
            delete: (domain, key) => <DeleteModal key={key} icon type={type} instance={domain} />
        },
        traefik: {
            viewRoutes: (route, key) =>  <Link key={key} to={detailsPath(menuGroup, route.id)} role='option' className='item'>
                <Dropdown.Item text={intl.formatMessage(messages.viewWebRoute)} onClick={() => { }} />
            </Link>,
            viewCertificate: (route, key) =>  <Link key={key} to={certificateDetailsPath(menuGroup, route.id)} role='option' className='item'>
                <Dropdown.Item text={intl.formatMessage(messages.viewWebRoute)}/>
            </Link>
        }

    };

    return (
        <Dropdown direction='left' icon='ellipsis vertical' className='users-list__actions_dot'>
            <Dropdown.Menu >
                {options.map((option, key) => actions[type][option](instance, key))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

OptionsMenu.propTypes = {
    intl: PropTypes.any,
    instance: PropTypes.object,
    type: PropTypes.string,
    options: PropTypes.array
};

export default injectIntl(OptionsMenu);
