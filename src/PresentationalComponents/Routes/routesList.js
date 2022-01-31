import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import ApiButton from '../apiButton';
import { copyInfo } from '../../Utilities/copyInfo';
import TableHeader from '../../GeneralComponents/tableHeader';
import OptionsMenu from '../../GeneralComponents/optionsMenu';
import Route from '../../../static/images/route.svg';
import { useSelector } from 'react-redux';

const RoutesList = ({ items }) => {
    const user = useSelector(state => state.ComputeStore.user);

    const headers = ['subnet', 'gateway', 'type', '', ''];

    const routeList = items.map((route, i) => {
        return (
            <Table.Row key={i}>
                <Table.Cell className='name-with-image-wrapper'>
                    <img src={Route} />
                    <div>
                        {route.destination} {copyInfo(route.destination)}
                    </div>
                </Table.Cell>
                <Table.Cell>{route.nexthop} {copyInfo(route.nexthop)}</Table.Cell>
                <Table.Cell>{'IPv4'}</Table.Cell>
                <Table.Cell textAlign='center'><ApiButton element='route' item ={route} /></Table.Cell>
                <Table.Cell collapsing textAlign='right'>
                    {/* insights.chrome.isAdmin() && <OptionsMenu type='routes' instance={route} options={['edit', 'delete']}/> */}
                    { user.role === 'admin' && <OptionsMenu type='routes' instance={route} options={['delete']}/>}
                </Table.Cell>
            </Table.Row>
        );
    });

    return (
        <Table unstackable>
            <TableHeader headers={headers}/>
            <Table.Body>{routeList}</Table.Body>
        </Table>
    );
};

RoutesList.propTypes = {
    items: PropTypes.array
};

export default RoutesList;
