import React, { useEffect, useRef, useState } from 'react';
import { injectIntl } from 'react-intl';
import { PropTypes } from 'prop-types';
import { Button, Grid, Header, Input, TextArea } from 'semantic-ui-react';
import messages from '../../Messages';
import './../../App.scss';
import './loadBalancer.scss';
import { useParams } from 'react-router-dom';
import { certificateDetailsPath, certificatesPath } from '../../Constants/routes';
import ButtonBack from '../../GeneralComponents/buttonBack';
import { certificatesMock } from './mock';
import CancelChangesModal from './CancelChangesModal';

const CreateEditCertificate = ({ intl }) => {
    const { menuGroup, id } = useParams();
    const [name, setName] = useState('');
    const [pathCertificate, setPathCertificate] = useState('');
    const [textCertificate, setTextCertificate] = useState('');
    const [pathPrivateKey, setPathPrivateKey] = useState('');
    const [textPrivateKey, setTextPrivateKey] = useState('');
    const [pathCaCertificate, setPathCaCertificate] = useState('');
    const [textCaCertificate, setTextCaCertificate] = useState('');
    const [pathDCaCertificate, setPathDCaCertificate] = useState('');
    const [textDCaCertificate, setTextDCaCertificate] = useState('');
    const [isOpenCancelChangesModal, setIsOpenCancelChangesModal] = useState(false);

    let refCertificate = useRef(null);
    let refPrivateKey = useRef(null);
    let refCaCertificate = useRef(null);
    let refDCaCertificate = useRef(null);

    const certificate = certificatesMock[id - 1];

    useEffect(()=>{
        if (id) {
            setName(certificate.name);
            setTextCertificate(certificate.certificate);
            setTextCaCertificate(certificate.caCertificate);
            setTextPrivateKey(certificate.key);
            setTextDCaCertificate(certificate.destCaCertificate);
        }

    }, []);

    const openCancelChangesModal = (isOpen = true) => {
        setIsOpenCancelChangesModal(isOpen);
    };

    //upload files using button
    const callbackField = (e, setPath, setText) => {
        setPath(e.currentTarget.value);
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.readAsText(file);
        reader.onloadend = () => {
            setText(reader.result);
        };
    };

    const onClickCertificate = () => {refCertificate.current.click();};

    const onClickPrivateKey = () => {refPrivateKey.current.click();};

    const onClickCaCertificate = () => {refCaCertificate.current.click();};

    const onClickDCaCertificate = () => {refDCaCertificate.current.click();};

    //Drag & Drop upload file
    const handleDragEnter = e => {
        e.preventDefault();
        console.log('drag enter');
    };

    const handleDragLeave = e => {
        e.preventDefault();
        console.log('drag leave');
    };

    const handleDragOver = e => {
        e.preventDefault();
        console.log('drag over');
    };

    const handleDrop = (e, setText) => {
        e.preventDefault();
        console.log('drag drop');
        let dt = e.dataTransfer;
        let file = dt.files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = () => {
            setText(reader.result);
        };
    };

    //onChange callbacks
    const onChangeName = (e) => {setName(e.currentTarget.value);};

    const onChangeCertificate = (e) => {setPathCertificate(e.currentTarget.value);};

    const onChangePrivateKey = (e) => {setPathPrivateKey(e.currentTarget.value);};

    const onChangeCaCertificate = (e) => {setPathCaCertificate(e.currentTarget.value);};

    const onChangeDCaCertificate = (e) => {setPathDCaCertificate(e.currentTarget.value);};

    const onChangeTextCertificate = (e) => {setTextCertificate(e.currentTarget.value);};

    const onChangeTextPrivateKey = (e) => {setTextPrivateKey(e.currentTarget.value);};

    const onChangeTextCaCertificate = (e) => {setTextCaCertificate(e.currentTarget.value);};

    const onChangeTextDCaCertificate = (e) => {setTextDCaCertificate(e.currentTarget.value);};

    //edit & create callback's
    const createCertificate = () => {alert('create');};

    const editCertificate = () => {alert('save changes');};

    //disabled button
    const disabledCreateBtn = () => name  === '' || textCertificate  === '' || textPrivateKey  === ''
	|| textCaCertificate  === '' || textDCaCertificate === '' ? true : false;

    const disabledSaveBtn = () => name === certificate.name && textCertificate === certificate.certificate
            && textCaCertificate === certificate.caCertificate && textPrivateKey === certificate.key
            && textDCaCertificate === certificate.destCaCertificate ? true : false;

    return <>
        <ButtonBack path={id ? certificateDetailsPath(menuGroup, id) : certificatesPath(menuGroup)} />

        <Grid style={{ padding: '0 20px' }}>
            <Grid.Row style={{ paddingBottom: '0px' }}>
                <Header as='h2' style={{ letterSpacing: '1px' }}>
                    {id ? intl.formatMessage(messages.editCertificate) : intl.formatMessage(messages.createCertificate)}
                </Header>
            </Grid.Row >
            <Grid.Row>
                <span className='subTitleForm'>{intl.formatMessage(messages.certificateDescript)}</span>
            </Grid.Row>

            <Grid.Row style={{ paddingBottom: '0px' }}>
                <h5>{intl.formatMessage(messages.name)}</h5>
            </Grid.Row>
            <Grid.Row>
                <Input type='text' className='inputPath' style={{ width: '80%' }} value={name} onChange={onChangeName}/>
            </Grid.Row>

            <Grid.Row style={{ paddingBottom: '0px' }}>
                <h5>{intl.formatMessage(messages.certificate)}</h5>
            </Grid.Row>
            <div className='dragArea'
                onDrop={e => handleDrop(e, setTextCertificate)}
                onDragOver={e => handleDragOver(e)}
                onDragEnter={e => handleDragEnter(e)}
                onDragLeave={e => handleDragLeave(e)}
            >
                <Grid.Row style={{ paddingBottom: '0px' }}>
                    <Input type='text' value={pathCertificate} className='inputPath' action='browse' onChange={onChangeCertificate}><input/>
                        <Button onClick={onClickCertificate}>{intl.formatMessage(messages.browse)}</Button>
                    </Input><input
                        type='file'
                        ref={refCertificate}
                        onChange={e => callbackField(e, setPathCertificate, setTextCertificate)}
                        style={{ display: 'none' }}
                        accept='.pem'
                    />
                </Grid.Row>
                <Grid.Row>
                    <span className='subTitleForm'>{intl.formatMessage(messages.certificateUpDescript)}</span>
                </Grid.Row>
                <Grid.Row>
                    <TextArea value={textCertificate} className='textAreaForCert' onChange={onChangeTextCertificate}/>
                </Grid.Row></div>

            <Grid.Row style={{ paddingBottom: '0px', marginTop: '10px'  }}>
                <h5>{intl.formatMessage(messages.privateKey)}</h5>
            </Grid.Row>
            <div className='dragArea'
                onDrop={e => handleDrop(e, setTextPrivateKey)}
                onDragOver={e => handleDragOver(e)}
                onDragEnter={e => handleDragEnter(e)}
                onDragLeave={e => handleDragLeave(e)}
            >
                <Grid.Row style={{ paddingBottom: '0px' }}>
                    <Input type='text' value={pathPrivateKey} className='inputPath' action='browse' onChange={onChangePrivateKey}><input/>
                        <Button onClick={onClickPrivateKey}>{intl.formatMessage(messages.browse)}</Button>
                    </Input>
                    <input
                        type='file'
                        ref={refPrivateKey}
                        onChange={e => callbackField(e, setPathPrivateKey, setTextPrivateKey)}
                        style={{ display: 'none' }}
                        accept='.pem'
                    />
                </Grid.Row>
                <Grid.Row>
                    <span className='subTitleForm'>{intl.formatMessage(messages.certificateKeyDescript)}</span>
                </Grid.Row>
                <Grid.Row>
                    <TextArea value={textPrivateKey} className='textAreaForCert' onChange={onChangeTextPrivateKey}/>
                </Grid.Row></div>

            <Grid.Row style={{ paddingBottom: '0px', marginTop: '10px'  }}>
                <h5>{intl.formatMessage(messages.caCertificate)}</h5>
            </Grid.Row>
            <div className='dragArea'
                onDrop={e => handleDrop(e, setTextCaCertificate)}
                onDragOver={e => handleDragOver(e)}
                onDragEnter={e => handleDragEnter(e)}
                onDragLeave={e => handleDragLeave(e)}
            >
                <Grid.Row style={{ paddingBottom: '0px' }}>
                    <Input type='text' value={pathCaCertificate} className='inputPath' action='browse' onChange={onChangeCaCertificate}><input/>
                        <Button onClick={onClickCaCertificate}>{intl.formatMessage(messages.browse)}</Button>
                    </Input>
                    <input
                        type='file'
                        ref={refCaCertificate}
                        onChange={e => callbackField(e, setPathCaCertificate, setTextCaCertificate)}
                        style={{ display: 'none' }}
                        accept='.pem'
                    />
                </Grid.Row>
                <Grid.Row>
                    <span className='subTitleForm'>{intl.formatMessage(messages.certificateCaDescript)}</span>
                </Grid.Row>
                <Grid.Row>
                    <TextArea value={textCaCertificate} className='textAreaForCert' onChange={onChangeTextCaCertificate}/>
                </Grid.Row></div>

            <Grid.Row style={{ paddingBottom: '0px', marginTop: '10px'  }}>
                <h5>{intl.formatMessage(messages.caCertificateDes)}</h5>
            </Grid.Row>
            <div className='dragArea'
                onDrop={e => handleDrop(e, setTextDCaCertificate)}
                onDragOver={e => handleDragOver(e)}
                onDragEnter={e => handleDragEnter(e)}
                onDragLeave={e => handleDragLeave(e)}
            >
                <Grid.Row style={{ paddingBottom: '0px' }}>
                    <Input type='text' value = {pathDCaCertificate} className='inputPath' action='browse' onChange={onChangeDCaCertificate}><input />
                        <Button onClick={onClickDCaCertificate}>{intl.formatMessage(messages.browse)}</Button>
                    </Input>
                    <input
                        type='file'
                        ref={refDCaCertificate}
                        onChange={e => callbackField(e, setPathDCaCertificate, setTextDCaCertificate)}
                        style={{ display: 'none' }}
                    />
                </Grid.Row>
                <Grid.Row>
                    <span className='subTitleForm'>{intl.formatMessage(messages.certificateDestDescript)}</span>
                </Grid.Row>
                <Grid.Row>
                    <TextArea value={textDCaCertificate} className='textAreaForCert' onChange={onChangeTextDCaCertificate}/>
                </Grid.Row></div>
        </Grid>

        <div className='footer'>
            <Button
                content={intl.formatMessage(messages.cancel)}
                onClick={()=>setIsOpenCancelChangesModal(true)}
                disabled={id ? disabledSaveBtn() : disabledCreateBtn()}/>
            <Button
                onClick={id ? editCertificate : createCertificate}
                primary
                type='submit'
                content={id ? intl.formatMessage(messages.save) : intl.formatMessage(messages.create)}
                disabled={id ? disabledSaveBtn() : disabledCreateBtn()}
            />
        </div>
        {isOpenCancelChangesModal && <CancelChangesModal
            open={isOpenCancelChangesModal}
            setOpen={openCancelChangesModal}
            type = 'forCertificate'
        />}
    </>;
};

CreateEditCertificate.propTypes = {
    intl: PropTypes.any,
    type: PropTypes.any
};

export default injectIntl(CreateEditCertificate);
