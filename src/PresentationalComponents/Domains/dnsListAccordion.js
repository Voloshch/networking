import React, { useState } from 'react';
import { Table, Accordion, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

const DnsListAcordeon = ({ records, index, recordName, dnsCells }) => {
    const [active, setActive] = useState(false);

    const accordionContent = records.map(record => (<Table.Row key={'dns-' + record.name}>{dnsCells(record)}</Table.Row>));

    return (
        <Table.Cell colSpan='5' style={{ padding: '0.8em 0' }}>
            <Accordion>
                <Accordion.Title
                    active={active}
                    index={index}
                    onClick={() => setActive(!active)}
                >
                    <Icon name='dropdown' />
                    {recordName}
                </Accordion.Title>
                <Accordion.Content active={active}>
                    <Table style={{ border: 'none' }}>
                        <Table.Body>{accordionContent}</Table.Body>
                    </Table>
                </Accordion.Content>
            </Accordion>
        </Table.Cell>
    );
};

export default injectIntl(DnsListAcordeon);

DnsListAcordeon.propTypes = {
    headers: PropTypes.array,
    records: PropTypes.array,
    index: PropTypes.number,
    colSizes: PropTypes.object,
    recordName: PropTypes.number,
    dnsCells: PropTypes.func
};
