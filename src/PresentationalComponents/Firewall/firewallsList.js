
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Table } from 'semantic-ui-react';
import ApiButton from '../apiButton';
import AssignedVMModal from './assignedVMModal';
import messages from '../../Messages';
import { Link, useParams } from 'react-router-dom';
import { groupPath } from '../../Constants/routes';
import OptionsMenu from '../../GeneralComponents/optionsMenu';
import Loading from '../../../static/images/spinner.gif';
import Firewall from '../../../static/images/firewall.svg';
import { useSelector } from 'react-redux';

const FirewallList = ({ items, intl }) => {
    const { menuGroup } = useParams();
    const user = useSelector(state => state.ComputeStore.user);

    return (
        <Table unstackable>
            <Table.Body>
                {items.map((group, index) => (
                    <Table.Row key={index}>
                        <Table.Cell className='name-with-image-wrapper'>
                            <img src={group.isLoading && group.assigned_vms.length === 0 ? Loading : Firewall} />
                            <div>
                                {group.id ?
                                    <Link to={groupPath(group.id, menuGroup)}>{group.name}</Link>
                                    : group.name
                                }
                            </div>
                        </Table.Cell>
                        <Table.Cell>{intl.formatMessage(messages.rules)} : {group.firewall_rules.length}</Table.Cell>
                        <Table.Cell>{intl.formatMessage(messages.assignedVmNics)} : <AssignedVMModal count={group.assigned_vms.length} /></Table.Cell>
                        <Table.Cell textAlign='right'><ApiButton element='firewall' item={group} /></Table.Cell>
                        <Table.Cell collapsing textAlign='right'>
                            {/* insights.chrome.isAdmin() && <OptionsMenu type='firewalls' instance={group} options={['edit', 'delete']}/> */}
                            { user.role === 'admin' && <OptionsMenu type='firewalls' instance={group} options={['delete']} />}
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

FirewallList.propTypes = {
    intl: PropTypes.any,
    items: PropTypes.array
};

export default injectIntl(FirewallList);
