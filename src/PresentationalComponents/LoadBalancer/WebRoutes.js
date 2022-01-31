import React, { useEffect } from 'react';
import ContentPage from '../../GeneralComponents/contentPage';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../../Messages';
import WebRoutesList from './WebRoutesList';
import { fetchWebRoutes, fetchWebRoutesService } from '../../AppActions';

const WebRoutes = () => {
    const routes = useSelector(state => state.ComputeStore.traefikRoutes);
    const routesFetchStatus = useSelector(state => state.ComputeStore.traefikRoutesStatus);
    const user = useSelector(state => state.ComputeStore.user);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchWebRoutes());
        dispatch(fetchWebRoutesService());
    }, [dispatch, user]
    );

    return (
        <ContentPage status={routesFetchStatus} pageData={routes} title={messages.webRoutes}
            componentDataList={WebRoutesList} noContentMessage={messages.noWebRoutes}
        />
    );

};

export default WebRoutes;
