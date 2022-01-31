/* eslint camelcase: 0 */
import * as ActionTypes from './AppConstants';
import Immutable from 'seamless-immutable';
import { certificatesMock } from '../src/PresentationalComponents/LoadBalancer/mock';

// eslint-disable-next-line new-cap
const initialState = Immutable({
    networks: [],
    assignedVms: [],
    networksFetchStatus: '',
    assignedVmsFetchStatus: '',
    network: {},
    networkFetchStatus: '',
    groups: [],
    groupsFetchStatus: '',
    group: {},
    groupFetchStatus: '',
    traefikRoutes: [],
    traefikRoutesStatus: '',
    traefikRoute: {},
    traefikRouteStatus: '',
    traefikRouteServices: [],
    traefikRouteServicesStatus: '',
    traefikRouteDeleteStatus: '',
    certificates: certificatesMock,
    certificatesStatus: 'fulfilled',
    certificate: {},
    routes: [],
    routesFetchStatus: '',
    route: {},
    routeFetchStatus: '',
    routerId: '',
    providerId: '',
    user: {},
    token: '',
    domains: [],
    domainsFetchStatus: '',
    domain: {},
    domainFetchStatus: '',
    // dnsRecords: [],
    // dnsRecordsFetchStatus: '',
    dnsZones: [],
    dnsZonesFetchStatus: '',
    dnsZonesRecordsFetchStatus: '',
    allVms: [],
    allVmsFetchStatus: '',
    accounts: [],
    lang: 'en'
});

export const ComputeStore = (state = initialState, action) => {
    switch (action.type) {

    case `${ActionTypes.ASSIGNED_VMS_FETCH}_PENDING`:
        return state.set('assignedVmsFetchStatus', 'pending');
    case `${ActionTypes.ASSIGNED_VMS_FETCH}_REJECTED`:
        return state.set('assignedVmsFetchStatus', 'rejected');
    case `${ActionTypes.ASSIGNED_VMS_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            assignedVms: action.payload,
            assignedVmsFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.NETWORKS_FETCH}_PENDING`:
        return state.set('networksFetchStatus', 'pending');
    case `${ActionTypes.NETWORKS_FETCH}_REJECTED`:
        return state.set('networksFetchStatus', 'rejected');
    case `${ActionTypes.NETWORKS_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            networks: action.payload,
            networksFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.NETWORK_FETCH}_PENDING`:
        return state.set('networkFetchStatus', 'pending');
    case `${ActionTypes.NETWORK_FETCH}_REJECTED`:
        return state.set('networkFetchStatus', 'rejected');
    case `${ActionTypes.NETWORK_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            network: action.payload,
            networkFetchStatus: 'fulfilled'
        });

    case ActionTypes.NETWORK_TEMP_ADD:
        return state.set('networks', [action.payload, ...state.networks]);
    case ActionTypes.NETWORK_TEMP_REMOVE:
        // eslint-disable-next-line
        const index = state.networks.filter(network => network.isLoading).findIndex(network => network.name.endsWith('_' + action.payload))
        if (index > -1) {
            return state.set('networks', [...state.networks.slice(0, index), ...state.networks.slice(index + 1)]);
        }

        return state;

    case `${ActionTypes.SECURITY_GROUPS_FETCH}_PENDING`:
        return state.set('groupsFetchStatus', 'pending');
    case `${ActionTypes.SECURITY_GROUPS_FETCH}_REJECTED`:
        return state.set('groupsFetchStatus', 'rejected');
    case `${ActionTypes.SECURITY_GROUPS_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            groups: action.payload.resources,
            groupsFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.SECURITY_GROUP_FETCH}_PENDING`:
        return state.set('groupFetchStatus', 'pending');
    case `${ActionTypes.SECURITY_GROUP_FETCH}_REJECTED`:
        return state.set('groupsetchStatus', 'rejected');
    case `${ActionTypes.SECURITY_GROUP_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            group: action.payload,
            groupFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.ROUTES_FETCH}_PENDING`:
        return state.set('routesFetchStatus', 'pending');
    case `${ActionTypes.ROUTES_FETCH}_REJECTED`:
        return state.set('routesFetchStatus', 'rejected');
    case `${ActionTypes.ROUTES_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            routes: action.payload.routes,
            routerId: action.payload.routerId,
            routesFetchStatus: 'fulfilled'
        });

    case ActionTypes.SECURITY_GROUP_TEMP_ADD:
        return state.set('groups', [action.payload, ...state.groups]);

    case ActionTypes.SECURITY_GROUP_LOADER:
        return state.set('groups', state.groups.map(group => {
            if (group.id === action.payload) {
                return { ...group, isLoading: true };
            }

            return group;
        }));
        // case `${ActionTypes.ROUTE_FETCH}_REJECTED`:
        //     return state.set('routesFetchStatus', 'rejected');
        // case `${ActionTypes.ROUTE_FETCH}_PENDING`:
        //     return state.set('routeFetchStatus', 'pending');
        // case `${ActionTypes.ROUTE_FETCH}_FULFILLED`:
        //     return Immutable.merge(state, {
        //         route: action.payload,
        //         routeFetchStatus: 'fulfilled'
        //     });

    case `${ActionTypes.PROVIDER_ID_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            providerId: action.payload
        });

    case ActionTypes.USER_UPDATE:
        return state.set('user', action.payload);
    case ActionTypes.ROLE_UPDATE:
        return state.set('user', { ...state.user, role: action.payload });
    case ActionTypes.ACCOUNT_UPDATE:
        return state.set('user', { ...state.user, account: action.payload });
    case ActionTypes.LOCATION_UPDATE:
        return state.set('user', { ...state.user, location: action.payload });
    case ActionTypes.TOKEN_UPDATE:
        return state.set('token', action.payload);
    case ActionTypes.CHANGE_LANG:
        return state.set('lang', action.payload);
    case ActionTypes.UPDATE_ACCOUNTS:
        return state.set('accounts', action.payload);

    case `${ActionTypes.DNS_ZONE_FETCH}_PENDING`:
        return state.set('dnsZonesFetchStatus', 'pending');
    case `${ActionTypes.DNS_ZONE_FETCH}_REJECTED`:
        return state.set('dnsZonesFetchStatus', 'rejected');
    case `${ActionTypes.DNS_ZONE_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            dnsZones: action.payload,
            dnsZonesFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.DNS_ZONE_CREATE}_PENDING`:
        return state.set('dnsZonesFetchStatus', 'pending');
    case `${ActionTypes.DNS_ZONE_CREATE}_REJECTED`:
        return state.set('dnsZonesFetchStatus', 'rejected');
    case `${ActionTypes.DNS_ZONE_CREATE}_FULFILLED`:
        return Immutable.merge(state, {
            dnsZones: [...state.dnsZones, action.payload.data],
            dnsZonesFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.DNS_ZONE_RECORDS_FETCH}_PENDING`:
        return state.set('dnsZoneRecordsFetchStatus', 'pending');
    case `${ActionTypes.DNS_ZONE_RECORDS_FETCH}_REJECTED`:
        return state.set('dnsZoneRecordsFetchStatus', 'rejected');
    case `${ActionTypes.DNS_ZONE_RECORDS_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            domain: {
                ...state.domain,
                dnsZoneRecords: action.payload
            },
            dnsZoneRecordsFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.DNS_ZONE_RECORDS_CREATE}_PENDING`:
        return state.set('dnsZoneRecordsFetchStatus', 'pending');
    case `${ActionTypes.DNS_ZONE_RECORDS_CREATE}_REJETED`:
        return state.set('dnsZoneRecordsFetchStatus', 'rejected');
    case `${ActionTypes.DNS_ZONE_RECORDS_CREATE}_FULFILLED`:
        return Immutable.merge(state, {
            domain: { ...state.domain, dnsZoneRecords: [...state.domain.dnsZoneRecords, action.payload.data] },
            dnsZoneRecordsFetchStatus: 'fulfilled'
        });

    case `${ActionTypes.ALL_VMS_FETCH}_PENDING`:
        return state.set('allVmsFetchStatus', 'pending');
    case `${ActionTypes.ALL_VMS_FETCH}_REJECTED`:
        return state.set('allVmsFetchStatus', 'rejected');
    case `${ActionTypes.ALL_VMS_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            allVms: action.payload.resources,
            allVmsFetchStatus: 'fulfilled'
        });

    case 'LOAD-BALANCER-SET-CERTIFICATE' :
        return Immutable.merge(state, {
            ...state.certificate, certificate: state.certificates[action.id - 1] });

    case `${ActionTypes.WEB_ROUTES_FETCH}_PENDING`:
        return state.set('traefikRoutesStatus', 'pending');
    case `${ActionTypes.WEB_ROUTES_FETCH}_REJECTED`:
        return state.set('traefikRoutesStatus', 'rejected');
    case `${ActionTypes.WEB_ROUTES_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            traefikRoutes: action.payload.scope,
            traefikRoutesStatus: 'fulfilled'
        });

    case `${ActionTypes.WEB_ROUTES_SERVICES_FETCH}_PENDING`:
        return state.set('traefikRouteServicesStatus', 'pending');
    case `${ActionTypes.WEB_ROUTES_SERVICES_FETCH}_REJECTED`:
        return state.set('traefikRouteServicesStatus', 'rejected');
    case `${ActionTypes.WEB_ROUTES_SERVICES_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            traefikRouteServices: action.payload,
            traefikRouteServicesStatus: 'fulfilled'
        });

    case `${ActionTypes.WEB_ROUTE_FETCH}_PENDING`:
        return state.set('traefikRouteStatus', 'pending');
    case `${ActionTypes.WEB_ROUTE_FETCH}_REJECTED`:
        return state.set('traefikRouteStatus', 'rejected');
    case `${ActionTypes.WEB_ROUTE_FETCH}_FULFILLED`:
        return Immutable.merge(state, {
            traefikRoute: action.payload,
            traefikRouteStatus: 'fulfilled'
        });

    case  `${ActionTypes.WEB_ROUTE_DELETE}_PENDING`:
        return state.set('traefikRouteDeleteStatus', 'pending');
    case `${ActionTypes.WEB_ROUTE_DELETE}_REJECTED`:
        return state.set('traefikRouteDeleteStatus', 'rejected');
    case `${ActionTypes.WEB_ROUTE_DELETE}_FULFILLED`:
        return Immutable.merge(state, {
            traefikRouteDeleteStatus: 'fulfilled'
        });
    case ActionTypes.WEB_ROUTE_DELETE_RESET:
        return Immutable.merge(state, {
            traefikRouteDeleteStatus: ''
        });
        //*Certificates API not working yet
        // case `${ActionTypes.CERTIFICATES_FETCH}_PENDING`:
        //     return state.set('certificatesStatus', 'pending');
        // case `${ActionTypes.CERTIFICATES_FETCH}_REJECTED`:
        //     return state.set('certificatesStatus', 'rejected');
        // case `${ActionTypes.CERTIFICATES_FETCH}_FULFILLED`:
        //     return Immutable.merge(state, {
        //         certificates: action.payload,
        //         certificatesStatus: 'fulfilled'
        //     });

    default:
        return state;
    }

};
