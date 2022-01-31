import React, { useEffect } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDnsZoneRecords } from '../../AppActions';
import messages from '../../Messages';
import PropTypes from 'prop-types';
import ButtonBack from '../../GeneralComponents/buttonBack';
import { domainsPath } from '../../Constants/routes';
import DeleteModal from './../../GeneralComponents/deleteModal';
import CreateDns from './createDns';
import DnsList from './dnsList';

const DomainDetails = ({ intl }) => {
    const { zoneName, menuGroup } = useParams();
    const currentDnsZoneData = useSelector(state => state.ComputeStore.domain);
    const dnsZonesFetchStatus = useSelector(state => state.ComputeStore.dnsZonesFetchStatus);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDnsZoneRecords(zoneName));
    }, [dispatch, zoneName]);

    // Set the type value to upper case & rename the host value to ip
    let currentDnsZoneRecords = currentDnsZoneData.dnsZoneRecords?.map((item) => {
        return {
            ...item,
            type: item.type?.toUpperCase(),
            data: item.data || '-'
        };
    });

    return (
        <>
            <ButtonBack path={domainsPath(menuGroup)} />
            {(dnsZonesFetchStatus === 'fulfilled' && currentDnsZoneRecords) ?
                <Grid>
                    <Grid.Row verticalAlign='middle'>
                        <Grid.Column className='domain-details--label'>
                            {intl.formatMessage(messages.domain)}
                        </Grid.Column>
                        <Grid.Column className='color--green' width={11}>{zoneName}</Grid.Column>
                    </Grid.Row>

                    <CreateDns />

                    <DnsList dnsList={currentDnsZoneRecords || []} />

                    <Grid.Row verticalAlign='middle' className='network-delete'>
                        <Grid.Column width={2}><b>{intl.formatMessage(messages.delete).toUpperCase()}</b></Grid.Column>
                        <Grid.Column width={5}>{intl.formatMessage(messages.deleteDnsZoneWarningMessage)}</Grid.Column>
                        <Grid.Column width={2}><DeleteModal type='dnsZone' button instance={{ name: zoneName }} /></Grid.Column>
                    </Grid.Row>
                </Grid> :
                <Loader active inline='centered' />
            }
        </>
    );
};

DomainDetails.propTypes = {
    intl: PropTypes.any
};

export default injectIntl(DomainDetails);
