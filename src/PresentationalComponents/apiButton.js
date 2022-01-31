
/* eslint-disable camelcase */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Header, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import CodeSnippetOptions from './ApiDialog/CodeSnippetOptions';
import CodeSnippet from './ApiDialog/CodeSnippet';
import EscapeOutside from 'react-escape-outside';
import { useParams } from 'react-router-dom';

const ApiButton = ({ direction, element, item }) => {
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const providerId = useSelector(state => state.ComputeStore.providerId);
    const userToken = localStorage.getItem('cs_jwt');
    const baseUrl = 'https://compute.zby.icdc.io/api';
    const [activeItem, setActiveItem] = useState({
        action: 'TOKEN',
        tool: 'CURL'
    });

    const returnPorts = (ports) => {
        let dashPosition = ports.indexOf('-');
        let minPort = ports.substring(0, dashPosition);
        let maxPort = ports.substring(dashPosition + 1);
        return {
            min: minPort,
            max: maxPort
        };
    };

    const networks = (network) => ({
        action: 'create',
        name: network.name
    });

    const subnet = (network) => ({
        subnet:
        {
            cidr: network.subnet,
            ip_version: 4,
            network_protocol: network.type,
            dns_nameservers: [network.dns],
            name: network.name + '_subnet'
        }
    });

    const groupsCreate = (group) => ({
        action: 'create',
        name: group.name
    });

    const groupsDelete = (group) => ({
        action: 'remove',
        name: group.name,
        id: group.id
    });

    const rulesForCreate = (rule) => ({
        action: 'add_firewall_rule',
        direction: rule.direction === 'outbound' ? 'egress' : 'ingress',
        port_range_min: returnPorts(rule.port).min,
        port_range_max: returnPorts(rule.port).max,
        protocol: rule.hostProtocol?.toLowerCase(),
        remote_group_id: rule.groupRule,
        security_group_id: rule.exceptionId,
        source_ip_range: rule.sourceIpRange
    });

    const rulesForDelete = (rule) => ({
        action: 'remove_firewall_rule',
        id: rule.exceptionEms
    });

    const routes = (route) => ({
        action: 'add_route',
        subnet: route.destination,
        gateway: route.nexthop
    });

    const vmCreate = (vmInterface) => ({
        action: 'add_to_port',
        nic_ids: [vmInterface.nicId]
    });

    const vmDelete = (vmInterface) => ({
        action: 'remove_from_port',
        nic_id: vmInterface.nicId
    });

    const data = (item, type) => {
        /*eslint-disable*/
        switch (element) {
            case 'network':
                return item.subnet ? JSON.stringify({ ...networks(item), ...subnet(item) }) : JSON.stringify(networks(item));
            case 'vmTable':
                return JSON.stringify(type === 'create' ? vmCreate(item) : vmDelete(item));
            case 'firewall':
                return JSON.stringify(type === 'create' ? groupsCreate(item) : groupsDelete(item));
            case 'rule':
                return JSON.stringify(type === 'create' ? rulesForCreate(item) : rulesForDelete(item));
            case 'route':
                return JSON.stringify(routes(item));
        }
        /*eslint-enable*/
    };

    const url = () => {
        /*eslint-disable*/
        switch (element) {
            case 'network':
                return `${baseUrl}/providers/${providerId}/cloud_networks/`;
            case 'firewall':
                return `${baseUrl}/providers/${providerId}/security_groups`;
            case 'vmTable':
                return `${baseUrl}/security_groups/${id}`;
            case 'rule':
                return `${baseUrl}/security_groups/${item.exceptionId}`;
            case 'route':
                return `${baseUrl}/network_routers/${providerId}`;
        }
        /*eslint-enable*/
    };

    const inputValue = `curl -H 'Authorization: Bearer ${userToken}' \n -d '${data(item)}' ${url()}`;

    const displaySnippet = () => {
        /*eslint-disable*/
        switch (activeItem.action.toLowerCase()) {
            case 'token':
                return `export ICDC_TOKEN="${userToken}"`;
            case 'create':
                return `curl -X POST -H "Authorization: Bearer $ICDC_TOKEN" \n -d ${data(item, 'create')} \n ${url()}`;
            case 'get':
                return `curl -H "Authorization: Bearer $ICDC_TOKEN" \n ${url()}`;
            case 'delete':
                return `curl -X POST -H "Authorization: Bearer $ICDC_TOKEN" \n -d ${data(item, 'delete')} \n ${url()}`;
        }
        /*eslint-enable*/
    };

    const handleClose = () => {
        setOpen(false);
    };

    const copy = (value) => {
        const singleLineValue = value.replaceAll('\n', '');
        navigator.clipboard.writeText(singleLineValue)
            .catch(err => {
                console.log('Something went wrong', err); // eslint-disable-line no-console
            });
    };

    const actionsArray = element === 'vmTable' ? ['TOKEN', 'CREATE', 'DELETE'] : ['TOKEN', 'GET', 'CREATE', 'DELETE'];
    const toolsArray = ['CURL'];

    return (
        <EscapeOutside onEscapeOutside={handleClose}>
            <div className='dropdown-api'>
                <button className='api-button' onClick={() => setOpen(true)} >API<Icon name='caret down' /></button>
                {element === 'firewall' || element === 'rule' || element === 'vmTable' ?
                    <div className={(open === true ? 'visible ' : '') + 'menu-api '
                        + (direction === 'right' ? 'firewall-api-right' : 'firewall-api-left')}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className='api-dialog-content'>
                                <CodeSnippetOptions
                                    tabs={actionsArray}
                                    navTitle='Action'
                                    activeItem={activeItem}
                                    setActiveItem={setActiveItem}
                                />
                                <CodeSnippetOptions
                                    tabs={toolsArray}
                                    navTitle='Tool'
                                    activeItem={activeItem}
                                    setActiveItem={setActiveItem}
                                />
                            </div>
                            <div className='api-dialog-snippet-wrapper'>
                                <CodeSnippet content={displaySnippet()} copyFuncion={copy} />
                            </div>
                        </div>
                    </div> :
                    <div className={(open === true ? 'visible ' : '') + 'menu-api ' + (direction === 'right' ? 'menu-api-right' : 'menu-api-left')}>
                        <Header className='menu-api_header' as='h4'>Use curl for this request</Header>
                        <div className='menu-api_copy-input'>
                            <input className='menu-api_input' value={inputValue} readOnly onFocus={(e) => e.target.select()} />
                            <button onClick={()=>copy(inputValue)}><Icon name='copy' /></button>
                        </div>
                    </div>
                }
            </div>
        </EscapeOutside>
    );
};

ApiButton.propTypes = {
    direction: PropTypes.any,
    element: PropTypes.any,
    item: PropTypes.any
};

export default ApiButton;
