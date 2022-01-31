
import React, { useEffect } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ApiButton from '../apiButton';
import ReturnSgrTable from './returnSgrTable';
import ButtonBack from '../../GeneralComponents/buttonBack';
import { groupsPath } from '../../Constants/routes';
import { fetchSecurityGroup, fetchSecurityGroups, assignNicsToSecurityGroupAndFetch, unassignNicsFromSecurityGroupAndFetch } from '../../AppActions';
import FirewallImg from '../../../static/images/firewall.svg';
import FirewallModal from '../Firewall/firewallModal';
import ReturnVmTable from './returnVmTable';
import { injectIntl } from 'react-intl';
import messages from '../../Messages';
import DeleteModal from './../../GeneralComponents/deleteModal';
import PropTypes from 'prop-types';

const FirewallDetails = ({ intl }) => {
    const { id, menuGroup } = useParams();
    const group = useSelector(state => state.ComputeStore.group);
    const groups = useSelector(state => state.ComputeStore.groups);
    const groupFetchStatus = useSelector(state => state.ComputeStore.groupFetchStatus);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSecurityGroups());
        dispatch(fetchSecurityGroup(id));
    }, [dispatch, id]);

    const assignNicsAndFetch = (nics) => {
        const payload = {
            action: 'add_to_port',
            // eslint-disable-next-line camelcase
            nic_ids: nics
        };
        dispatch(assignNicsToSecurityGroupAndFetch(payload, group.id));
    };

    const deleteNicAndFetch = (id) => () => {
        const payload = {
            action: 'remove_from_port',
            // eslint-disable-next-line camelcase
            nic_id: id
        };
        dispatch(unassignNicsFromSecurityGroupAndFetch(payload, group.id));
    };

    let infoGroup = groupFetchStatus === 'fulfilled' ?
        <>
            <ReturnSgrTable rules={group.firewallRules} group={group} groups={groups} />
            <hr />
            <ReturnVmTable vmInterfaces={group.assignedVms} showModalButton onModalSubmit={assignNicsAndFetch} onDelete={deleteNicAndFetch} />
        </>
        :
        <Loader active inline='centered' className="firewall-loader" />;

    return <>
        <ButtonBack path={groupsPath(menuGroup)} />
        <Grid>
            <Grid.Row>
                <Grid.Column verticalAlign='middle'><img className="img__firewall" src={FirewallImg} /></Grid.Column>
                <Grid.Column verticalAlign='middle' className='inline-cell-wrapper'>
                    {group.name} <FirewallModal classNameDrop="edit-firewall" edit noText group={group} />
                </Grid.Column>
                <Grid.Column verticalAlign='middle'><ApiButton direction='right' element='firewall' item={group} /></Grid.Column>
            </Grid.Row>
            {infoGroup}
            <Grid.Row verticalAlign='middle' className='network-delete'>
                <Grid.Column width={2}><b>{intl.formatMessage(messages.delete).toUpperCase()}</b></Grid.Column>
                <Grid.Column width={5}>{intl.formatMessage(messages.deleteSecurityGroupDesc)}</Grid.Column>
                <Grid.Column width={2}><DeleteModal type='firewalls' button instance={group} /></Grid.Column>
            </Grid.Row>
        </Grid>
    </>;
};

FirewallDetails.propTypes = {
    intl: PropTypes.any
};

export default injectIntl(FirewallDetails);
