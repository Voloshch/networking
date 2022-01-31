import React, { useEffect } from 'react';
import { Grid, Header, Loader } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNetwork } from '../../AppActions';
import ApiButton from '../apiButton';
import Network from '../../../static/images/Network.png';
import NetworkModal from '../Networks/networkModal';
import ReturnVmTable from './returnVmTable';
import messages from '../../Messages';
import PropTypes from 'prop-types';
import ButtonBack from '../../GeneralComponents/buttonBack';
import { networksPath } from '../../Constants/routes';
import { copyInfo } from '../../Utilities/copyInfo';
import DeleteModal from './../../GeneralComponents/deleteModal';

const NetworkDetails = ({ intl }) => {
    const { id, menuGroup } = useParams();
    const currNetwork = useSelector(state => state.ComputeStore.network);
    const networkFetchStatus = useSelector(state => state.ComputeStore.networkFetchStatus);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchNetwork(id));
    }, [dispatch, id]);

    let infoVM = networkFetchStatus === 'fulfilled' ?
        <ReturnVmTable headerMesage={intl.formatMessage(messages.assignedVm)} vmInterfaces={currNetwork.assignedVms} />
        :
        <Loader active inline='centered' className="firewall-loader" />;

    return <>
        <ButtonBack path={networksPath(menuGroup)} />
        <Grid>
            <Grid.Row verticalAlign='middle'>
                <Grid.Column className='inline-cell-wrapper'>
                    <div className='name-with-image-wrapper'>
                        <img src={Network} />
                        <div>
                            {currNetwork.name}
                        </div>
                    </div>
                </Grid.Column>
                <Grid.Column ><ApiButton direction='right' element='network' item ={currNetwork} /></Grid.Column>
                <Grid.Column width={2}><NetworkModal edit details network={currNetwork}/></Grid.Column>
            </Grid.Row>
            <Header className='network-details' as='h4'>{intl.formatMessage(messages.netDetails)}</Header>
            <Grid.Row className='network-table' verticalAlign='middle'>
                <Grid.Column className='network-table-title'>{intl.formatMessage(messages.subnet)}</Grid.Column>
                <Grid.Column className='network-table-content'>
                    {currNetwork.subnet || String.fromCharCode(8212)}{copyInfo(currNetwork.subnet)}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row verticalAlign='middle' className='network-table'>
                <Grid.Column className='network-table-title'>{intl.formatMessage(messages.type)}</Grid.Column>
                <Grid.Column className='network-table-content'>{currNetwork.type || String.fromCharCode(8212)}</Grid.Column>
            </Grid.Row>
            <Grid.Row verticalAlign='middle' className='network-table'>
                <Grid.Column className='network-table-title'>DNS</Grid.Column>
                <Grid.Column className='network-table-content'>{currNetwork.dns || String.fromCharCode(8212)}{copyInfo(currNetwork.dns)}</Grid.Column>
            </Grid.Row>
            {infoVM}
            <Grid.Row verticalAlign='middle' className='network-delete'>
                <Grid.Column width={2}><b>{intl.formatMessage(messages.delete).toUpperCase()}</b></Grid.Column>
                <Grid.Column width={5}>{intl.formatMessage(messages.deleteVpsDetailsDesc)}</Grid.Column>
                <Grid.Column width={2}><DeleteModal type='networks' button instance={currNetwork} /></Grid.Column>
            </Grid.Row>
        </Grid>
    </>;
};

NetworkDetails.propTypes = {
    intl: PropTypes.any
};

export default injectIntl(NetworkDetails);
