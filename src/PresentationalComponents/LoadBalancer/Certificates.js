import React from 'react';
import ContentPage from '../../GeneralComponents/contentPage';
import { useSelector } from 'react-redux';
import messages from '../../Messages';
import CertificatesList from './CertificatesList';

const Certificates = () => {
    const certificates = useSelector(state => state.ComputeStore.certificates);
    const  certificatesFetchStatus = useSelector(state => state.ComputeStore.certificatesStatus);
    // const user = useSelector(state => state.ComputeStore.user);

    // const dispatch = useDispatch();
    //*Certificates API not working yet
    // useEffect(() => {
    //     dispatch(fetchCertificates());
    // }, [dispatch, user]
    // );

    return (
        <ContentPage status={certificatesFetchStatus} pageData={certificates} title={messages.certificates}
            componentDataList={CertificatesList} noContentMessage={messages.noCertificates}
        />
    );
};

export default Certificates;

