import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { PropTypes } from 'prop-types';
import messages from '../../Messages';
import { Input, Table, Button } from 'semantic-ui-react';
import './loadBalancer.scss';
import OptionsMenu from '../../GeneralComponents/optionsMenu';
import { Link, useParams } from 'react-router-dom';
import { createroutePath } from '../../Constants/routes';
import { detailsPath } from '../../Constants/routes';
import { onSearch } from '../../Utilities/search';

const WebRoutesList = ({ items, intl }) => {
    const { menuGroup } = useParams();
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setFilteredData(onSearch(items, search));
    }, [search, items]);

    const headerRow = [
        { title: intl.formatMessage(messages.name) },
        { title: intl.formatMessage(messages.hostname) },
        { title: intl.formatMessage(messages.service) },
        { title: intl.formatMessage(messages.targetPort) },
        { title: intl.formatMessage(messages.tlsTermination) },
        { title: '' }
    ];

    const routes = filteredData.map(el => {
        const options = ['viewRoutes'];
        const service = (route) => route.services.map(e => e.name).join(', ');

        return (
            <Table.Row key={el.id}>
                <Table.Cell width={2}>
                    <div>
                        <Link to={detailsPath(menuGroup, el.id)}>{el.name}</Link>
                    </div>
                </Table.Cell>

                <Table.Cell width={3}>{el.hostname}</Table.Cell>
                <Table.Cell width={2}>{service(el)}</Table.Cell>
                <Table.Cell width={2}>{el.target_port}</Table.Cell>
                <Table.Cell width={2}>{el.tls_termination}</Table.Cell>
                <Table.Cell width={6} textAlign='right'>
                    {true && <OptionsMenu type='traefik' instance={el} options={options} /> || ''}
                </Table.Cell>
            </Table.Row>);
    });

    return (
        <section style={{ padding: '0 20px' }}>
            <div className='tools'>
                <Input
                    icon='search'
                    iconPosition='left'
                    placeholder={intl.formatMessage(messages.searchField)}
                    style={{ width: '600px', margin: '10px 0px 20px 30px' }}
                    value={search}
                    onChange={e => setSearch(e.currentTarget.value)}
                />
                <Link to={createroutePath(menuGroup)}>
                    <Button primary size="medium" style={{ height: '40px' }}>{intl.formatMessage(messages.createRoute)}</Button>
                </Link>
            </div>
            <div>
                <Table basic="very">
                    <Table.Header >
                        <Table.Row >
                            {headerRow.map((el, index) => (
                                <Table.HeaderCell key={index}>
                                    {el.title}
                                </Table.HeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    {filteredData.length > 0 && <Table.Body>{routes}</Table.Body>}
                </Table>
            </div>
        </section>
    );
};

WebRoutesList.propTypes = {
    items: PropTypes.any,
    intl: PropTypes.any
};

export default injectIntl(WebRoutesList);
