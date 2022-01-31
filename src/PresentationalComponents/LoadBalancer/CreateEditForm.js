import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { PropTypes } from 'prop-types';
import { Button, Header, Input, Checkbox, Dropdown, Icon, Form } from 'semantic-ui-react';
import messages from '../../Messages';
import './loadBalancer.scss';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CancelChangesModal from './CancelChangesModal';
import { createWebRoute, fetchWebRoute, updateWebRoute } from '../../AppActions';
import FormField from './FormField';

const CreateEditForm = ({ intl }) => {
    const { id } = useParams();
    const user = useSelector(state => state.ComputeStore.user);
    const currentRoute = useSelector(state => state.ComputeStore.traefikRoute.route);
    const currentRouteStatus = useSelector(state => state.ComputeStore.traefikRouteStatus);
    const dispatch = useDispatch();

    const [listServices, setListServices] = useState([{ id: Math.floor(Math.random() * 1000000) }]);
    const [isOpenCancelChangesModal, setIsOpenCancelChangesModal] = useState(false);
    let state = {
        /* eslint camelcase: 0 */
        name: '',
        hostname: '',
        path: '',
        target_port: '',
        tls_termination: '',
        insecure: '',
        certificate_id: '',
        owner: '',
        ip_version: 4,
        cloud_gateway_id: 1,
        source_proto: 'tcp',
        destination_proto: 'tcp',
        services: listServices
    };
    const [form, setForm] = useState(state);
    const [split, setSplit] = useState(false);
    const [secure, setSecure] = useState(false);
    const [weight, setWeight] = useState(0);
    const [weightMode, setWeightMode] = useState(0);

    const tlsOptions = [{ text: 'edge', value: 'edge' }, { text: 'passthrough', value: 'passthrough' }, { text: 're-encrypt', value: 're-encrypt' }];
    const insecureOptions = [{ text: 'none', value: 'none' }, { text: 'allow', value: 'allow' }, { text: 'redirect', value: 'redirect' }];
    const certificatesOptions = [{ text: '1', value: '1' }, { text: '2', value: '2' }, { text: '3', value: '3' }]; //! from API certificates
    const servicesOptions = id ? listServices.map(el => ({ text: el.name, value: el.name }))
        : [{ text: '1', value: '1' }, { text: '2', value: '2' }, { text: '3', value: '3' }]; //! from API Services

    //field validations
    const portValidation = new RegExp('^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$');
    const weightValidation = new RegExp('^([0-9]{1,2}|1[0-9]{1,2}|2[0-4][0-9]|25[0-6])$');
    let targetPortErr = !portValidation.test(form.target_port) && form.target_port !== '' ? true : false;
    let weightErr = !weightValidation.test(weight) ? true : false;

    useEffect(() => {
        (id && currentRouteStatus === 'fulfilled') &&
		setForm(currentRoute);
        (id && currentRouteStatus === 'fulfilled') &&
		setListServices(currentRoute?.services);
        (id && currentRouteStatus === 'fulfilled' && currentRoute.tls_termination !== '') &&
        setSecure(true);
        (id && currentRouteStatus === 'fulfilled' && currentRoute.services.length > 0) &&
		setSplit(true);
    }, [currentRoute, currentRouteStatus, id]);

    useEffect(() => {
        id &&  dispatch(fetchWebRoute(id));
    }, [dispatch, id]);

    useEffect(() => {
        setForm({ ...form, owner: user.email });
    }, [user]);

    useEffect(() => {
        split === false && setListServices([...listServices].filter((el, i) => i === 0));
        split === false && setWeightMode(0);
    }, [split]);

    useEffect(() => {
        secure === false && setForm({ ...form, tls_termination: '' });
    }, [secure]);

    const openCancelChangesModal = (isOpen = true) => {
        setIsOpenCancelChangesModal(isOpen);
    };

    //disabled buttons
    const disabledCreateBtn = () => form.name === '' || targetPortErr || weightErr ? true : false;

    const addService = () => {setWeightMode(1); setListServices([...listServices, { id: Math.random() }]); setSplit(true);};

    const deleteService = (id) => {listServices.length > 1 && setListServices([...listServices].filter(e => e.id !== id));};

    const createRouteHandler = () => {dispatch(createWebRoute({ route: { ...form, path: form.path === '' ? '/' : form.path,
        target_port: form.target_port === '' ? '8080' : form.target_port } })); setForm(state);};

    const changeRouteHandler = () => {dispatch(updateWebRoute({ route: form }, id));};

    const altServices = listServices?.length > 1 || weightMode === 1 || split === true ? listServices.map((s) => (
        <section className='addService' key={s.id}>
            <div className='firstField'>
                <label>{intl.formatMessage(messages.service)}</label>
                <Dropdown selection value={s.name} options={servicesOptions} placeholder='None' style={{ width: '98%' }}
                    onChange={() => setForm({ ...form, services: [...form.services, { id: 1 }] })}/>
                <span className='subTitleForm'>{intl.formatMessage(messages.altService)}</span>
                <span className='altServiceControl' >
                    <p onClick={() => deleteService(s.id)}>{intl.formatMessage(messages.deleteService)}</p>|
                    <p onClick={addService}>{intl.formatMessage(messages.anotherService)}</p></span>
            </div>
            <div className='secondField'>
                <label>{intl.formatMessage(messages.weight)}</label><Form.Field error={weightErr}>
                    <Input value={weight} onChange={(e) => {setWeight(e.currentTarget.value);}} type='number'
                        style={{ width: '100%' }} max={256} min={0}/></Form.Field>
                <span className='subTitleForm'>{intl.formatMessage(messages.weightDescript)}</span>
            </div>
        </section>))
        : <section className='addOneService'>
            <div>
                <label>{intl.formatMessage(messages.service)}</label>
                <Dropdown selection value={form.services[0]?.name} options={servicesOptions} placeholder='None' style={{ width: '100%' }}
                    onChange={() => setForm({ ...form, services: [...form.services, { id: 1 }] })}/>
                <span className='subTitleForm'>{intl.formatMessage(messages.altService)}</span>
                <span className='altServiceControl'>
                    <p onClick={deleteService}>{intl.formatMessage(messages.deleteService)}</p>|
                    <p onClick={addService}>{intl.formatMessage(messages.anotherService)}</p></span>
            </div><br/>
            <div>
                <label>{intl.formatMessage(messages.weight)}</label>
                <div>
                    <div className='rangeValues'>
                        <span>{`catalog: ${Math.ceil(((weight * 100) / 256) * 100) / 100}%`}</span>
                        <span>{`${100 - Math.ceil(((weight * 100) / 256) * 100) / 100}% ${intl.formatMessage(messages.service)}`}</span></div>
                    <input type='range' min={0} max={256} step={64} value={weight}
                        onChange={(e) => {setWeight(e.currentTarget.value);}} style={{ width: '100%' }}/>
                    <div className='marks'><div/><div/><div/><div/></div>
                </div>
                <span className='subTitleForm'>{intl.formatMessage(messages.percTraffic)}
                    <a onClick={() => setWeightMode(1)}>{intl.formatMessage(messages.editLink)}</a>
                </span>
            </div>
        </section>;

    return <Form className='formContainer'>
        <FormField
            value={form.name}
            label={intl.formatMessage(messages.nameSecurityGroups)}
            placeholder='my-route'
            callback={e => setForm({ ...form, name: e.currentTarget.value })}
        />
        <span className='subTitleForm'>{intl.formatMessage(messages.traefikUniqName)}</span>

        <FormField
            value={form.hostname}
            label={`${intl.formatMessage(messages.hostname)} ${intl.formatMessage(messages.optional)}`}
            placeholder='www.example.com'
            callback={e => setForm({ ...form, hostname: e.currentTarget.value })}
        />
        <span className='subTitleForm'>{intl.formatMessage(messages.traefikPublHostname)}</span>
        <span className='subTitleForm'>	{intl.formatMessage(messages.traefikPublHostnameDescript)}</span>

        <FormField
            value={form.path}
            label={`${intl.formatMessage(messages.path)} ${intl.formatMessage(messages.optional)}`}
            placeholder='/'
            callback={e => setForm({ ...form, path: e.currentTarget.value })}
        />
        <span className='subTitleForm'>{intl.formatMessage(messages.traefikPath)}</span>

        <FormField
            value={form.target_port}
            label={`${intl.formatMessage(messages.targetPort)} ${intl.formatMessage(messages.optional)}`}
            placeholder='8080 → 8080 (TCP)'
            callback={e => setForm({ ...form, target_port: e.currentTarget.value })}
            error={targetPortErr}
        />
        <span className='subTitleForm'>{intl.formatMessage(messages.traefikTargetPortDescript)}</span>

        <Header as='h4'>{intl.formatMessage(messages.traefikAltServices)}</Header>
        <Checkbox label={intl.formatMessage(messages.traefikSplitTraffic)} checked={split} onChange={(e, { checked }) => { setSplit(checked);}}/>
        <span className='subTitleForm'>{intl.formatMessage(messages.traefikSplitTrafficDescript)}</span>
        {altServices}
        <Header as='h4'>{intl.formatMessage(messages.security)}</Header>
        <Checkbox label={intl.formatMessage(messages.traefikSecRoute)} checked={secure} onChange={(e, { checked }) => { setSecure(checked);}}/>
        <span className='subTitleForm'>{intl.formatMessage(messages.traefikSecRouteDescript)}</span>

        <label>{intl.formatMessage(messages.tlsTermination)}</label>
        <Dropdown selection value={form.tls_termination} options={tlsOptions} placeholder='None' disabled={!secure}
            onChange={(param, data) => setForm({ ...form, tls_termination: data.value })}/>
        <a style={{ marginBottom: '10px', width: '140px' }}>{intl.formatMessage(messages.learnMore)}<Icon name='external alternate'/></a>

        <label>{intl.formatMessage(messages.traefikInsTraffic)}</label>
        <Dropdown selection value={form.insecure} options={insecureOptions} placeholder='None'
            onChange={(param, data) => setForm({ ...form, insecure: data.value })}/>
        <span className='subTitleForm'>{intl.formatMessage(messages.traefikInsTrafficDescript)}</span>

        <label>{intl.formatMessage(messages.traefikTlsCertificate)}</label>
        <Dropdown selection value='' options={certificatesOptions} placeholder='None'
            onChange={(param, data) => setForm({ ...form, certificate_id: data.value })}/>

        <div className='formActions'>
            <Button
                content={intl.formatMessage(messages.cancel)}
                onClick={() => setIsOpenCancelChangesModal(true)}
                disabled={disabledCreateBtn()}/>
            <Button
                onClick={id ? changeRouteHandler : createRouteHandler}
                primary
                content={id ? intl.formatMessage(messages.save) : intl.formatMessage(messages.create)}
                disabled={disabledCreateBtn()}
            />
        </div>
        {isOpenCancelChangesModal && <CancelChangesModal
            open={isOpenCancelChangesModal}
            setOpen={openCancelChangesModal}
            type = 'forRoute'
        />}
    </Form>;
};

CreateEditForm.propTypes = {
    intl: PropTypes.any,
    type: PropTypes.string
};

export default injectIntl(CreateEditForm);
