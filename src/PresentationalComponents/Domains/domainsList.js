import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import TableHeader from '../../GeneralComponents/tableHeader';
import DeleteModal from '../../GeneralComponents/deleteModal';
import { domainPath } from '../../Constants/routes';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DomainsList = ({ items }) => {
    const headers = ['domainName', ''];
    const { menuGroup } = useParams();

    const user = useSelector(state => state.ComputeStore.user);

    const domainList = items.map((domain, index) => {
        return (
            <Table.Row key={index}>
                <Table.Cell>
                    <Link to={domainPath(domain.name, menuGroup)}>{domain.name}</Link>
                </Table.Cell>
                <Table.Cell collapsing textAlign='right'>
                    {/* TODO: Check if the zone is epmty and then enable the user to delete */}
                    {/* {insights.chrome.isAdmin() && !domain.metadata.service && <DeleteModal icon type='dnsZone' instance={domain} />} */}
                    { user.role === 'admin' && <DeleteModal icon type='dnsZone' instance={domain} />}
                </Table.Cell>
            </Table.Row>
        );
    });

    return (
        <Table unstackable>
            <TableHeader headers={headers} />
            <Table.Body>{domainList}</Table.Body>
        </Table>
    );
};

DomainsList.propTypes = {
    items: PropTypes.array
};

export default DomainsList;
