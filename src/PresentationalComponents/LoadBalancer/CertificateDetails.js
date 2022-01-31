import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import messages from '../../Messages';
import { PropTypes } from 'prop-types';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Grid, Header, Loader, Table } from 'semantic-ui-react';
import './loadBalancer.scss';
import ButtonBack from '../../GeneralComponents/buttonBack';
import { fetchMockCertificate } from '../../AppActions';
import { certificatesPath, editCertificatePath } from '../../Constants/routes';
import DeleteModal from './DeleteModal';
import { copyInfo } from '../../Utilities/copyInfo';
import { Link } from 'react-router-dom';

const CertificateDetails = ({ intl }) => {
    const { menuGroup,  id } = useParams();
    const certificate = useSelector((state) => state.ComputeStore.certificate);
    const certificatesStatus = useSelector((state) => state.ComputeStore.certificatesStatus);
    const [selectedElement, setSelectedElement] = useState(null);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMockCertificate(id));
    }, [dispatch, id]);

    const openDeleteModal = (isOpen = true) => {
        setSelectedElement(certificate);
        setIsOpenDeleteModal(isOpen);
    };

    const deleteCertificate = (id) => {alert(`delete certificate #${id}`);};

    return (<section>
        <ButtonBack path={certificatesPath(menuGroup)} />
        {certificatesStatus !== 'fulfilled' || !Object.keys(certificate).length
            ? <Loader active inline="centered"/>
            : <><Grid>
                <div className='certificateDetailsHeader'>
                    <Header>{certificate.name}</Header>
                    <span>
                        <Link to={editCertificatePath(menuGroup, id)}>
                            <Button basic color='black' size='small'>{intl.formatMessage(messages.edit)}</Button>
                        </Link>
                        <Button color='red' size='small' onClick={openDeleteModal}>{intl.formatMessage(messages.delete)}</Button>
                    </span>
                </div>
                <Grid.Row className='certDetailsRow'>
                    <Table style={{ wordBreak: 'break-all' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell textAlign='left'>{intl.formatMessage(messages.key)}</Table.HeaderCell>
                                <Table.HeaderCell textAlign='right'>{copyInfo(certificate.key)}</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell className='keyOfCertificate'>
                                    {intl.formatMessage(messages.mockKey).substr(0, 210)}...
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Grid.Row>
                <Grid.Row className='certDetailsRow'>
                    <Table style={{ wordBreak: 'break-all' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell textAlign='left'>{intl.formatMessage(messages.caCertificate)}</Table.HeaderCell>
                                <Table.HeaderCell textAlign='right'>{copyInfo(certificate.certificate)}</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell className='keyOfCertificate'>
                                    {intl.formatMessage(messages.mockKey).substr(0, 210)}...
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Grid.Row>
                <Grid.Row className='certDetailsRow'>
                    <Header as="h3">{intl.formatMessage(messages.destinationCertificate)}</Header>
                </Grid.Row>
                <Grid.Row className='certDetailsRow'>
                    <Header as="h5" style={{ width: '700px' }}>
                        {certificate.certificate === '' ? intl.formatMessage(messages.none) : certificate.destCaCertificate}
                    </Header>
                </Grid.Row>
            </Grid>
            {selectedElement && <DeleteModal
                open={isOpenDeleteModal}
                setOpen={openDeleteModal}
                element={selectedElement}
                type = 'certificate'
                callback={deleteCertificate}
            />}
            </>}
    </section>);
};

CertificateDetails.propTypes = {
    intl: PropTypes.any
};
export default injectIntl(CertificateDetails);
