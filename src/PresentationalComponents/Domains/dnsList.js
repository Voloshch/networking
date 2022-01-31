import React, { useState } from 'react';
import { Table, Grid, Header, Pagination, Label } from 'semantic-ui-react';
import messages from '../../Messages';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import TableHeader from '../../GeneralComponents/tableHeader';
import DeleteModal from './../../GeneralComponents/deleteModal';

const DnsList = ({ dnsList, intl }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const headers = ['id', 'name', 'type', 'data', 'ttl', ''];
    const emptyValue = String.fromCharCode(8212);

    const colSizes = {
        name: 2,
        data: 5
    };

    const postsPerPage = 9;
    const totalPaginationPages = Math.ceil(dnsList.length / 9);
    const sliceStart = currentPage * postsPerPage;
    const sliceEnd = Math.min(dnsList.length, sliceStart + postsPerPage);
    const paginationPageData = dnsList.slice(sliceStart, sliceEnd);

    const labelsData = (record) => {
        //port* priority weight
        if (record.type === 'SRV') {
            return [
                { name: 'port', value: record.port },
                { name: 'priority', value: record.priority || '' },
                { name: 'weight', value: record.weight || '' }
            ];
        }

        if (record.type === 'MX') {
            return [{ name: 'priority', value: record.priority || '' }];
        }
    };

    const dnsCells = (dnsRecord) => {
        const dnsRow = headers.map(colName => {
            const checkForEmptyId = dnsRecord[colName] === null ? emptyValue : dnsRecord[colName];
            const tableValue = colName === 'id' ? checkForEmptyId : dnsRecord[colName];
            let recordLabels = [];
            if (colName === 'data' && dnsRecord.type === 'SRV' || colName === 'data' && dnsRecord.type === 'MX') {
                recordLabels = labelsData(dnsRecord).filter(property => property.value !== '').map((property, key) => {
                    return (
                        <Label key={key} className='domains-record-tags'>
                            {property.name}
                            <Label.Detail>{property.value}</Label.Detail>
                        </Label>
                    );
                });
            }

            return (
                <Table.Cell
                    key={'dns-' + dnsRecord.name + '-col-' + colName}
                    width={colSizes[colName] || 1}
                >
                    {colName ?
                        <div style={{ display: 'flex' }}>
                            <div style={colName === 'data' ? { marginRight: '20px' } : {}} > {tableValue}</div> <div>{recordLabels}</div>
                        </div> :
                        <div style={{ textAlign: 'center' }}><DeleteModal icon type='domains' instance={dnsRecord} /></div>}
                </Table.Cell>
            );
        });
        return dnsRow;
    };

    const dnsZoneRecords = paginationPageData.map((item, key) => <Table.Row key={key}>{dnsCells(item)}</Table.Row>);

    const handlePageChange = (_, pageInfo) => setCurrentPage(pageInfo.activePage - 1);

    return <>
        <Header as='h4'>{intl.formatMessage(messages.dnsRecords)}</Header>

        <Table unstackable className="item-list">
            <TableHeader headers={headers} colSizes={colSizes} />
            <Table.Body>
                {dnsZoneRecords}
            </Table.Body>
        </Table>

        {dnsList.length > 9 &&
            <Grid.Row className='pagination__vm'>
                <Pagination
                    activePage={currentPage + 1}
                    totalPages={totalPaginationPages}
                    onPageChange={handlePageChange}
                    ellipsisItem={null}
                />
            </Grid.Row>
        }

        {dnsList.length === 0 &&
            <Grid.Row className='pagination__novm'>
                <Grid.Column className='novm-text'>{intl.formatMessage(messages.noDnsRecords)}</Grid.Column>
            </Grid.Row>
        }
    </>;
};

DnsList.propTypes = {
    dnsList: PropTypes.array,
    intl: PropTypes.any
};

export default injectIntl(DnsList);
