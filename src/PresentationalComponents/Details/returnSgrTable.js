import React, { useState, useEffect, useCallback } from 'react';
import { Table, Dropdown, Grid, Header, Input, Pagination, Button } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ApiButton from '../apiButton';
import messages from '../../Messages';
import TableHeader from '../../GeneralComponents/tableHeader';
import { onSearch } from '../../Utilities/search';
import FormRule from '../Firewall/formRule';
import { createRuleActionAndFetch, editRuleActionAndFetch, deleteRuleActionAndFetch } from '../../AppActions';
import { useDispatch } from 'react-redux';

const ReturnSgrTable = ({ rules, group, groups, intl }) => {
    const traffics = [intl.formatMessage(messages.inbound), intl.formatMessage(messages.outbound)];
    const ipTypeArray = ['IPV4', 'IPV6'];
    const protocols = [intl.formatMessage(messages.any, { value: '' }), 'ICMP', 'TCP', 'UDP'];
    const allIpRange = '0-65535';
    const [rulesData, setRulesData] = useState('');
    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [oldActivePage, setoldActivePage] = useState(1);
    const [paginationMass, setPaginationMass] = useState([]);
    const [open, setOpen] = useState(false);
    const [editRule, setEditRule] = useState(null);

    const dispatch = useDispatch();

    const getPaginationMass = () => {
        let paginationMassVar = [];
        if (activePage === totalPages) {
            paginationMassVar = result.slice((activePage - 1) * 10, rulesData.length + 1);
            setPaginationMass(paginationMassVar);
        } else {
            paginationMassVar = result.slice((activePage - 1) * 10, activePage * 10);
            setPaginationMass(paginationMassVar);
        }
    };

    const onChange = (e) => setSearch(e.currentTarget.value);

    const pageChange = (_e, { activePage }) => {
        setActivePage(activePage);
        setoldActivePage(activePage);
    };

    const returnGroupEms = (id) => groups.find(group => group.id === id).ems_ref;

    const getRulesData = () => {
        let rulesData = [];

        rules.map((rule) => {
            let ruleData = {
                exceptionId: rule.id,
                exceptionEms: rule.ems_ref,
                direction: rule.direction,
                directionEn: rule.direction === 'inbound' ? 'Inbound' : 'Outbound',
                directionRu: rule.direction === 'inbound' ? 'Входящий' : 'Исходящий',
                port: (rule.port !== null || rule.end_port !== null) ?
                    ((rule.port !== null ? rule.port : 0) + '-' + rule.end_port) : '',
                ipType: rule.network_protocol.toUpperCase(),
                portRange: rule.end_port,
                hostProtocol: rule.host_protocol,
                sourceIpRange: rule.source_ip_range,
                groupRule: rule.source_security_group_id && returnGroupEms(rule.source_security_group_id) || null
            };
            rulesData.push(ruleData);
        });
        return rulesData;
    };

    useEffect(() => {
        setRulesData(getRulesData());
    }, []);

    useEffect(() => {
        setResult(rulesData);
        setTotalPages(Math.ceil(rulesData.length / 10));
        getPaginationMass();
    }, [rulesData]);

    useEffect(() => {
        setResult(onSearch(rulesData, search));
    }, [search, activePage, totalPages]);

    useEffect(() => {
        if (result) {
            setResult(result);
            setTotalPages(Math.ceil(result.length / 10));
            getPaginationMass();
        }
    }, [result, activePage, totalPages]);

    useEffect(() => {
        if (activePage !== oldActivePage && search === '') {
            setActivePage(oldActivePage);
        } else {
            setActivePage(1);
        }
    }, [search]);

    const handleClose = useCallback(
        () => {
            setEditRule(null);
            setOpen(false);
        },
        [setOpen]
    );

    const returnPorts = (ports) => {
        let dashPosition = ports.indexOf('-');
        let minPort = ports.substring(0, dashPosition);
        let maxPort = ports.substring(dashPosition + 1);
        return {
            min: minPort,
            max: maxPort
        };
    };

    const createMapPropsToApi = (rule) => {
        const containsDash = rule.port?.includes('-');
        const portValue = rule.port === '' || rule.port === null ? null : rule.port;

        return {
            action: 'add_firewall_rule',
            direction: rule.traffic.toLowerCase() === 'outbound' ? 'egress' : 'ingress',
            // eslint-disable-next-line camelcase
            network_protocol: rule.ipType.toLowerCase(),
            // eslint-disable-next-line camelcase
            port_range_min: !containsDash ? portValue : returnPorts(rule.port).min,
            // eslint-disable-next-line camelcase
            port_range_max: !containsDash ? portValue : returnPorts(rule.port).max,
            // eslint-disable-next-line camelcase
            protocol: rule.protocol === intl.formatMessage(messages.any, { value: '' }) ? null : rule.protocol.toLowerCase(),
            // eslint-disable-next-line camelcase
            remote_group_id: rule.group === '' ? null : rule.group,
            // eslint-disable-next-line camelcase
            security_group_id: group.ems === '-' ? null : group.ems,
            // eslint-disable-next-line camelcase
            source_ip_range: rule.ip === '' ? null : rule.ip
        };
    };

    const editMapPropsToApi = (rule) => {
        const containsDash = rule.port.includes('-');
        const portValue = rule.port === '' || rule.port === null ? null : rule.port;

        return {
            action: 'edit_firewall_rule',
            id: editRule,
            direction: rule.traffic.toLowerCase() === 'outbound' ? 'egress' : 'ingress',
            // eslint-disable-next-line camelcase
            network_protocol: rule.ipType.toLowerCase(),
            // eslint-disable-next-line camelcase
            port_range_min: !containsDash ? portValue : returnPorts(rule.port).min,
            // eslint-disable-next-line camelcase
            port_range_max: !containsDash ? portValue : returnPorts(rule.port).max,
            // eslint-disable-next-line camelcase
            protocol: rule.protocol === intl.formatMessage(messages.any, { value: '' }) ? null : rule.protocol.toLowerCase(),
            // eslint-disable-next-line camelcase
            remote_group_id: rule.group === '' ? null : rule.group,
            // eslint-disable-next-line camelcase
            security_group_id: group.ems === '-' ? null : group.ems,
            // eslint-disable-next-line camelcase
            source_ip_range: rule.ip === '' ? null : rule.ip
        };
    };

    const onSubmit = useCallback(
        (values) => {
            values.protocol === 'ICMP' ? values.port = null : values.port;
            handleClose();
            let payload = open && editRule === null ? createMapPropsToApi(values) : editMapPropsToApi(values);
            dispatch(open && editRule === null ? createRuleActionAndFetch(payload, group.id) : editRuleActionAndFetch(payload, group.id));
        },
        [handleClose, dispatch, editRule, open]
    );

    const addRule = () => {
        setEditRule(null);
        setOpen(true);
    };

    const mapRuleToProps = (rule) => ({
        traffic: rule.direction,
        ipType: rule.ipType,
        port: rule.port !== allIpRange ? rule.port : '',
        protocol: rule.hostProtocol.toLowerCase(),
        group: rule.groupRule,
        ip: rule.sourceIpRange
    });

    const mapNullRuleToProps = () => ({
        traffic: traffics[0],
        ipType: ipTypeArray[0],
        port: '',
        protocol: protocols[0],
        group: null,
        ip: ''
    });

    const deleteRuleMethod = useCallback(
        (e) => {
            let payload = {
                action: 'remove_firewall_rule',
                id: e.currentTarget.id
            };
            dispatch(deleteRuleActionAndFetch(payload, group.id));
        },
        [dispatch]
    );

    const returnGroup = (ems) => groups.find(group => group.ems_ref === ems).name;

    const headers = ['traffic', 'ipType', 'portRange', 'protocol', 'remoteSecurityGroup', 'remoteIpSubnet', '', ''];

    const directionRule = (direction) => {
        return direction === 'inbound' ? intl.formatMessage(messages.inbound) : intl.formatMessage(messages.outbound);
    };

    const rulesList = paginationMass && paginationMass.map((rule, index) => {
        if (editRule === rule.exceptionEms) {
            return (
                <FormRule key={index}
                    handleClose={handleClose}
                    handleSubmit={onSubmit}
                    initial={mapRuleToProps(rule)}
                    groups={groups}
                    traffics={traffics}
                    protocols={protocols}
                    ipType={ipTypeArray}
                />
            );
        }

        let port = '';
        if (rule.port) {
            const splitedPort = rule.port.trim().split('-');
            port = splitedPort[0] === splitedPort[1] ? splitedPort[0] : rule.port;
        }

        const emptySourceIpRange = rule.ipType === 'IPV6' ?
            intl.formatMessage(messages.any, { value: ' (::/0)' }) :
            intl.formatMessage(messages.any, { value: ' (0.0.0.0/0)' });

        return (
            <Table.Row key={index}>
                <Table.Cell>{directionRule(rule.direction)}</Table.Cell>
                <Table.Cell>{rule.ipType}</Table.Cell>
                <Table.Cell>{port || intl.formatMessage(messages.Any, { value: ' (0-65535)' })}</Table.Cell>
                <Table.Cell>{rule.hostProtocol || intl.formatMessage(messages.Any, { value: '' })}</Table.Cell>
                <Table.Cell>{rule.groupRule && returnGroup(rule.groupRule) || intl.formatMessage(messages.any, { value: '' })}</Table.Cell>
                <Table.Cell>{rule.sourceIpRange || emptySourceIpRange}</Table.Cell>
                <Table.Cell collapsing>
                    <ApiButton element='rule' item={rule} />
                </Table.Cell>
                <Table.Cell>
                    <Dropdown direction='left' icon='ellipsis vertical' className='users-list__actions_dot'>
                        <Dropdown.Menu >
                            <Dropdown.Item id={rule.exceptionEms} onClick={deleteRuleMethod} content={intl.formatMessage(messages.deleteRule)}
                                style={{ color: 'red' }}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    });

    return <>
        <div>
            <Header as='h4'> {intl.formatMessage(messages.rules)} ( {rulesData.length} ) </Header>
            <p className="color--grey">{intl.formatMessage(messages.firewallRulesDescription, { tag: <br /> })}</p>
        </div>
        <Grid.Row>
            <Grid.Column verticalAlign='middle' width={8}>
                <Input value={search} onChange={onChange} icon='search' placeholder={intl.formatMessage(messages.search)} />
            </Grid.Column>
            <Grid.Column textAlign='right' width={8}>
                <Button onClick={addRule} primary>{intl.formatMessage(messages.addRule)}</Button>
            </Grid.Column>
        </Grid.Row>
        <Table unstackable className='item-list'>
            <TableHeader headers={headers} />
            <Table.Body>
                {rulesList}
                {open && <>
                    <FormRule handleClose={handleClose}
                        handleSubmit={onSubmit}
                        initial={mapNullRuleToProps()}
                        groups={groups}
                        traffics={traffics}
                        protocols={protocols}
                        ipType={ipTypeArray}
                    />
                </>}
            </Table.Body>
        </Table>
        {
            rules.length > 10 && <Grid.Row className='pagination__vm'>
                <Pagination activePage={activePage} totalPages={totalPages} onPageChange={pageChange} />
            </Grid.Row>
        }
        {
            rules.length === 0 && open === false &&
            <Grid.Row className='pagination__novm'>
                <Grid.Column className='novm-text'>{intl.formatMessage(messages.noFirewallRules)}</Grid.Column>
            </Grid.Row>
        }
    </>;
};

ReturnSgrTable.propTypes = {
    rules: PropTypes.array,
    group: PropTypes.object,
    groups: PropTypes.array,
    intl: PropTypes.any
};

export default injectIntl(ReturnSgrTable);
