import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ContentPage from '../../GeneralComponents/contentPage';
import RouteModal from './routeModal';
import RoutesList from './routesList';
import { fetchRoutes } from '../../AppActions';
import messages from '../../Messages';

const Routes = () => {
    const routes = useSelector(state => state.ComputeStore.routes);
    const routesFetchStatus = useSelector(state => state.ComputeStore.routesFetchStatus);
    const user = useSelector(state => state.ComputeStore.user);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchRoutes());
    }, [dispatch, user]);

    return (
        <ContentPage status={routesFetchStatus} pageData={routes} title={messages.routes}
            componentDataList={RoutesList} componentModal={RouteModal} noContentMessage={messages.noRoutes}
        />
    );
};

export default Routes;
