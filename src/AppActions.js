import * as ActionTypes from './AppConstants';
import API from './Utilities/Api';
import cogoToast from 'cogo-toast';
import { store } from './Store';

/*
const fetchData = async (url, headers, options) => {
    headers = { Authorization: `Bearer ${localStorage.getItem('cs_jwt')}` };
    await insights.chrome.auth.getUser();
    const response = await API.get(url, headers, options);
    return response.data;
};*/

const waitingForBaseUrl = () => {
    const { locations } = window.insights.getUserInfo().external;
    const { location } = store.getState().ComputeStore.user;
    return locations[location];
};

const base = async (url, dns) => await waitingForBaseUrl() + `/api/${dns || 'compute'}/v1` + url;

const notificationOptions = { position: 'top-right', hideAfter: 7 };

const errorHandler = (error) => {
    if (error.includes('Could not find security_group with such id')) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].sgNotExist;
    }

    if (error.includes('Firewall rule edit error')) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].ruleEditError;
    }

    if (error.includes('Could not find network_router with such id')) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].routerNotExist;
    }

    if (error.includes('401')) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].unauthorized;
    }

    if (error.includes('Rule already exists')) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].ruleAlreadyExists;
    }

    if (error.includes(`Can't delete security group with assigned NICs`)) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].cannotDeleteGroupWithAssignedVmsNics;
    }

    return '';
};

const errorNotification = (error) => {
    const errorTypeCheck = error instanceof Object ? error.message : error;
    cogoToast.error(ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].error +
        errorHandler(errorTypeCheck), notificationOptions);
};

const successNotification = (msg) =>
    cogoToast.success(ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].success + msg, notificationOptions);

export const infoNotification = (msg) =>
    cogoToast.info(msg, notificationOptions);

const expandHeaders = async (headers) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        ...headers,
        Authorization: `Bearer ${window.insights.getToken()}`,
        X_MIQ_GROUP: `${user.account.toLowerCase()}.${user.role.toLowerCase()}`,
        'x-icdc-role': user.role,
        'x-icdc-account': user.account
    };
};

const fetchData = async (url, headers, payload, dns) => {
    const response = await API.get(await base(url, dns), await expandHeaders(headers), payload);
    return response.data;
};

const createData = async (url, headers, payload, dns) => {
    const response = await API.post(await base(url, dns), await expandHeaders(headers), payload);
    return response.data;
};

// const editData = async (url, headers, payload) => {
//     await insights.chrome.auth.getUser();
//     const response = await API.post(await base(url), await expandHeaders(headers), payload);
//     return response.data;
// };

const deleteData = async (url, headers, dns) => {
    const response = await API.delete(await base(url, dns), await expandHeaders(headers));
    return response;
};

const fetchDataGroups = async (url, headers, payload) => {
    return await fetchData(url, headers, payload).then(response => response);
    // await insights.chrome.auth.getUser();
    // const response = await API.get(base(url), await expandHeaders(headers), options);
    // return response.data.resources;
};

const fetchDataRoutes = async (url, headers, payload) => {
    return await fetchData(url, headers, payload)
        .then(response => ({
            routes: response.resources[0].extra_attributes.routes,
            routerId: response.resources[0].id
        }));
    // await insights.chrome.auth.getUser();
    // const response = await API.get(base(url), await expandHeaders(headers), options);
    // return { routes: response.data.resources[0].extra_attributes.routes, routerId: response.data.resources[0].id };
};

const fetchProviderId = async (url, headers, payload) => {
    return await fetchData(url, headers, payload).then(response => response.resources[0].id);
    // await insights.chrome.auth.getUser();
    // const response = await API.get(base(url), await expandHeaders(headers), options);
    // return response.data.resources[0].id;
};

// Used for deleting DNS Zones and Records
// const deleteData = async (url, headers, dns) => {
//     await insights.chrome.auth.getUser();
//     const response = await API.delete(base(url, dns), await expandHeaders(headers));
//     return response.data;
// };

const fetchCurrentNetwork = async (url, headers, options) => {
    const response = await API.get(await base(url), await expandHeaders(headers), options);
    let networkData = {
        name: response.data.cloud_network.name,
        subnet: response.data.cidr,
        type: response.data.network_protocol,
        dns: response.data.dns_nameservers[0],
        assignedVms: response.data.assigned_vms,
        netId: response.data.cloud_network_id
    };

    return networkData;
};

// const fetchCurrentNetwork = async (url, headers, options) => {
//     return await fetchData(url, headers, options)
//         .then(response => ({
//             name: response.data.cloud_network.name,
//             subnet: response.data.cidr,
//             type: response.data.network_protocol,
//             dns: response.data.dns_nameservers[0],
//             assignedVms: response.data.assigned_vms,
//             netId: response.data.cloud_network_id
//         }));
//     // await insights.chrome.auth.getUser();
//     // const response = await API.get(base(url), await expandHeaders(headers), options);
//     // let networkData = {
//     // };
//     // return networkData;
// };

const fetchVMsData = async (url, headers, options) => {
    const response = await API.get(await base(url), await expandHeaders(headers), options);
    let vmsArray = [];
    response.data.resources.forEach((item) => {
        vmsArray.push({
            subnetId: item.id,
            netId: item.cloud_network_id,
            vmsCount: item.assigned_vms.length
        });
    });

    return vmsArray;
};

const fetchCurrentSecurityGroup = async (url, headers, options) => {
    const response = await API.get(await base(url), await expandHeaders(headers), options);
    let securityGroup = {
        id: response.data.id,
        ems: response.data.ems_ref,
        name: response.data.name,
        firewallRules: response.data.firewall_rules,
        assignedVms: response.data.assigned_vms
    };

    return securityGroup;
};

const fetchNetworksData = async (url, headers, options) => {
    const response = await API.get(await base(url), await expandHeaders(headers), options);
    let networksArray = [];
    response.data.resources.forEach((item) => {
        networksArray.push({
            name: item.name,
            netId: item.id,
            emsRef: item.ems_ref
        });
        item.cloud_subnets.forEach((subnet) => {
            networksArray.push(Object.assign(networksArray.pop(), {
                id: subnet.id,
                subnet: subnet.cidr,
                type: subnet.network_protocol,
                dns: subnet.dns_nameservers[0]
            }));
        });
    });
    return networksArray;
};

export const fetchNetworks = (options) => ({
    type: ActionTypes.NETWORKS_FETCH,
    payload: fetchNetworksData(ActionTypes.NETWORKS_FETCH_URL, {}, options)
});

export const fetchVMs = (options) => ({
    type: ActionTypes.ASSIGNED_VMS_FETCH,
    payload: fetchVMsData(ActionTypes.ASSIGNED_VMS, {}, options)
});

export const fetchAllVMs = (options) => ({
    type: ActionTypes.ALL_VMS_FETCH,
    payload: fetchDataGroups(ActionTypes.ALL_VMS_URL, {}, options)
});

export const fetchNetwork = (id) => ({
    type: ActionTypes.NETWORK_FETCH,
    payload: fetchCurrentNetwork(ActionTypes.currentNetwork(id), {}, {})
});

export const fetchProvider = () => ({
    type: ActionTypes.PROVIDER_ID_FETCH,
    payload: fetchProviderId(ActionTypes.PROVIDER_ID_URL, {}, {})
});

export const createNetwork = (payload, id) => ({
    type: ActionTypes.NETWORK_CREATE,
    payload: createData(ActionTypes.networksUrl(id), {}, payload)
});

const addNetwork = (payload) => ({
    type: ActionTypes.NETWORK_TEMP_ADD,
    payload
});

const removeNetwork = (payload) => ({
    type: ActionTypes.NETWORK_TEMP_REMOVE,
    payload
});

export const removeTemporaryNetwork = (payload) => {
    return (dispatch) => dispatch(removeNetwork(payload));
};

export const addTemporaryNetwork = (payload) => {
    return (dispatch) => dispatch(addNetwork(payload));
};

export const createNetworkActionAndFetch = (payload, id) => {
    return (dispatch) => {
        const response = dispatch(createNetwork(payload, id));

        response.then(() => {
            dispatch(fetchNetworks());
            dispatch(fetchVMs());
            successNotification('');
        }, error => {
            dispatch(removeTemporaryNetwork(payload.name));
            errorNotification(error);
        });
    };
};

export const editNetwork = (payload, providerId) => ({
    type: ActionTypes.NETWORK_EDIT,
    payload: createData(ActionTypes.networkUrl(providerId), {}, payload)
});

export const editNetworkActionAndFetch = (payload, providerId) => {
    return (dispatch) => {
        const response = dispatch(editNetwork(payload, providerId));

        response.then(() => {
            dispatch(fetchNetworks());
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const deleteNetwork = (payload, providerId) => ({
    type: ActionTypes.NETWORK_DELETE,
    payload: createData(ActionTypes.networkUrl(providerId), {}, payload)
});

export const deleteNetworkActionAndFetch = (payload, providerId) => {
    return (dispatch) => {
        const response = dispatch(deleteNetwork(payload, providerId));

        response.then(() => {
            dispatch(fetchNetworks());
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const fetchSecurityGroups = (options) => ({
    type: ActionTypes.SECURITY_GROUPS_FETCH,
    payload: fetchDataGroups(ActionTypes.SECURITY_GROUPS_FETCH_URL, {}, options)
});

export const fetchSecurityGroup = (id) => ({
    type: ActionTypes.SECURITY_GROUP_FETCH,
    payload: fetchCurrentSecurityGroup(ActionTypes.getSecurityGroup(id), {}, {})
});

export const deleteSecurityGroup = () => ({
    type: ActionTypes.SECURITY_GROUP_DELETE,
    payload: successNotification('')
});

export const fetchRoutes = (options) => ({
    type: ActionTypes.ROUTES_FETCH,
    payload: fetchDataRoutes(ActionTypes.ROUTES_FETCH_URL, {}, options)
});

export const createRoute = (payload, routerId) => ({
    type: ActionTypes.ROUTE_CREATE,
    payload: createData(ActionTypes.routerUrl(routerId), {}, payload)
});

export const createRouteActionAndFetch = (payload, routerId) => {
    return (dispatch) => {
        const response = dispatch(createRoute(payload, routerId));
        response.then(() => {
            dispatch(fetchRoutes());
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const deleteRoute = (payload, routerId) => ({
    type: ActionTypes.ROUTE_DELETE,
    payload: createData(ActionTypes.routerUrl(routerId), {}, payload)
});

export const deleteRouteActionAndFetch = (payload, routerId) => {
    return (dispatch) => {
        const response = dispatch(deleteRoute(payload, routerId));

        response.then(() => {
            dispatch(fetchRoutes());
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const deleteRule = (payload, ruleId) => ({
    type: ActionTypes.RULE_DELETE,
    payload: createData(ActionTypes.ruleUrl(ruleId), {}, payload)
});

export const deleteRuleActionAndFetch = (payload, ruleId) => {
    return (dispatch) => {
        const response = dispatch(deleteRule(payload, ruleId));

        response.then(() => {
            dispatch(fetchSecurityGroup(ruleId));
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const createRule = (payload, groupId) => ({
    type: ActionTypes.RULE_CREATE,
    payload: createData(ActionTypes.ruleUrl(groupId), {}, payload)
});

export const createRuleActionAndFetch = (payload, groupId) => {
    return (dispatch) => {
        const response = dispatch(createRule(payload, groupId));
        response.then((responseFromServer) => {
            if (responseFromServer.value.success === 'false') {
                errorNotification(responseFromServer.value.message);
            } else {
                dispatch(fetchSecurityGroup(groupId));
                successNotification('');
            }
        }, error => errorNotification(error));
    };
};

export const editRule = (payload, groupId) => ({
    type: ActionTypes.RULE_EDIT,
    payload: createData(ActionTypes.ruleUrl(groupId), {}, payload)
});

export const editRuleActionAndFetch = (payload, groupId) => {
    return (dispatch) => {
        const response = dispatch(editRule(payload, groupId));

        response.then(() => {
            dispatch(fetchSecurityGroup(groupId));
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const createSecurityGroup = (payload, id) => ({
    type: ActionTypes.SECURITY_GROUP_CREATE,
    payload: createData(ActionTypes.securityGroupsUrl(id), {}, payload)
});

export const createSecurityGroupActionAndFetch = (payload, id) => {
    return (dispatch) => {
        const response = dispatch(createSecurityGroup(payload, id));

        response.then(() => {
            dispatch(fetchSecurityGroups());
            successNotification('');
        }, error => errorNotification(error));
    };
};

const addSecurityGroup = (payload) => ({
    type: ActionTypes.SECURITY_GROUP_TEMP_ADD,
    payload
});

export const addTemporarySecurityGroup = (payload) => {
    return (dispatch) => dispatch(addSecurityGroup(payload));
};

const securityGroupLoader = (payload) => ({
    type: ActionTypes.SECURITY_GROUP_LOADER,
    payload
});

export const addSecurityGroupLoader = (payload) => {
    return (dispatch) => dispatch(securityGroupLoader(payload));
};

export const deleteSecurityGroupAction = (payload, id) => ({
    type: ActionTypes.SECURITY_GROUP_DELETE,
    payload: createData(ActionTypes.securityGroupsUrl(id), {}, payload)
});

export const deleteSecurityGroupActionAndFetch = (payload, id, assignedVmsNics) => {
    return (dispatch) => {
        if (assignedVmsNics.length > 0) {
            return errorNotification(`Can't delete security group with assigned NICs`);
        } else {
            // successNotification(ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].removalProcessStarted);
            const response = dispatch(deleteSecurityGroupAction(payload, id));

            response.then(() => {
                dispatch(fetchSecurityGroups());
                successNotification('');
            }, error => errorNotification(error));
        }
    };
};

export const editSecurityGroup = (payload, id) => ({
    type: ActionTypes.SECURITY_GROUP_EDIT,
    payload: createData(ActionTypes.securityGroupsUrl(id), {}, payload)
});

export const editSecurityGroupActionAndFetch = (payload, id) => {
    return (dispatch) => {
        const response = dispatch(editSecurityGroup(payload, id));

        response.then(() => {
            dispatch(fetchSecurityGroups());
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const updateUser = (newUser) => ({
    type: ActionTypes.USER_UPDATE,
    payload: newUser
});

export const assignNicsToSecurityGroup = (payload, id) => ({
    type: ActionTypes.ASSIGN_NICS_TO_SECURITY_GROUP,
    payload: createData(ActionTypes.securityGroupUrl(id), {}, payload)
});

export const updateRole = (newRole) => ({
    type: ActionTypes.ROLE_UPDATE,
    payload: newRole
});

export const updateAccount = (newAccount) => ({
    type: ActionTypes.ACCOUNT_UPDATE,
    payload: newAccount
});

export const updateLocation = (newLocation) => ({
    type: ActionTypes.LOCATION_UPDATE,
    payload: newLocation
});

export const updateToken = (newLocation) => ({
    type: ActionTypes.TOKEN_UPDATE,
    payload: newLocation
});

export const unassignNicsToSecurityGroup = (payload, id) => ({
    type: ActionTypes.UNASSIGN_NICS_FROM_SECURITY_GROUP,
    payload: createData(ActionTypes.securityGroupUrl(id), {}, payload)
});

export const assignNicsToSecurityGroupAndFetch = (payload, id) => {
    return (dispatch) => {
        infoNotification('Assigning NICs...');
        const response = dispatch(assignNicsToSecurityGroup(payload, id));

        response.then(() => {
            dispatch(fetchSecurityGroup(id));
            successNotification('');
        }, error => {
            errorNotification(error);
        });
    };
};

//DOMAIN ACTIONS
export const fetchDnsZones = () => ({
    type: ActionTypes.DNS_ZONE_FETCH,
    payload: fetchData(ActionTypes.DNS_ZONE_URL, {}, {}, 'dns').then(response => response.data)
});

export const createDnsZone = (payload) => ({
    type: ActionTypes.DNS_ZONE_CREATE,
    payload: createData(ActionTypes.DNS_ZONE_URL, {}, payload, 'dns')
});

export const createAndFetchDnsZone = (payload) => {
    return (dispatch) => {
        const response = dispatch(createDnsZone(payload));

        response.then(() => {
            dispatch(fetchDnsZones());
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const deleteDnsZone = (zoneName) => ({
    type: ActionTypes.DNS_ZONE_DELETE,
    payload: deleteData(ActionTypes.dnsZoneUrl(zoneName), {}, 'dns')
});

export const deleteAndFetchDnsZone = (zoneName) => {
    return (dispatch) => {
        const response = dispatch(deleteDnsZone(zoneName));

        response.then(() => {
            dispatch(fetchDnsZones());
            successNotification('');
        }, error => errorNotification(error));
    };
};

// DNS ZONE RECORD ACTIONS
export const fetchDnsZoneRecords = (zoneName) => ({
    type: ActionTypes.DNS_ZONE_RECORDS_FETCH,
    payload: fetchData(ActionTypes.dnsZoneRecordsUrl(zoneName), {}, {}, 'dns').then(response => response.data)
});

export const createDnsZoneRecord = (zoneName, payload) => ({
    type: ActionTypes.DNS_ZONE_RECORDS_CREATE,
    payload: createData(ActionTypes.dnsZoneRecordsUrl(zoneName), {}, payload, 'dns')
});

export const createAndFetchDnsZoneRecord = (zoneName, payload) => {
    return (dispatch) => {
        const response = dispatch(createDnsZoneRecord(zoneName, payload));

        response.then(() => {
            dispatch(fetchDnsZoneRecords(zoneName));
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const deleteDnsZoneRecord = (zoneName, recordId, recordName) => ({
    type: ActionTypes.DNS_ZONE_RECORDS_DELETE,
    payload: deleteData(ActionTypes.dnsZoneRecordUrl(zoneName, recordId, recordName), {}, 'dns')
});

export const deleteAndFetchDnsZoneRecord = (zoneName, recordId, recordName) => {
    return (dispatch) => {
        const response = dispatch(deleteDnsZoneRecord(zoneName, recordId, recordName));

        response.then(() => {
            dispatch(fetchDnsZoneRecords(zoneName));
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const unassignNicsFromSecurityGroupAndFetch = (payload, id) => {
    return (dispatch) => {
        infoNotification('Unassigning NICs...');
        const response = dispatch(unassignNicsToSecurityGroup(payload, id));

        response.then(() => {
            dispatch(fetchSecurityGroup(id));
            successNotification('');
        }, error => {
            errorNotification(error);
        });
    };
};

// LOAD BALANCER ACTIONS
export const fetchMockCertificate = (id) => ({
    type: 'LOAD-BALANCER-SET-CERTIFICATE',
    id
});

const fetchWebRoutesData = async (url, headers, payload) => {
    const response = await API.get(await url, await expandHeaders(headers), payload);
    return response.data;
};

export const fetchWebRoutes = (options) => ({
    type: ActionTypes.WEB_ROUTES_FETCH,
    payload: fetchWebRoutesData(ActionTypes.WEB_ROUTES_FETCH_URL, {}, options)
});

const fetchWebRouteData = async (headers, id) => {
    const response = await API.get(`${ActionTypes.WEB_ROUTES_FETCH_URL}/${id}`, await expandHeaders(headers));
    return response.data;
};

export const fetchWebRoute = (id) => ({
    type: ActionTypes.WEB_ROUTE_FETCH,
    payload: fetchWebRouteData({}, id)
});

const fetchWebRoutesServiceData = async (url, headers, payload) => {
    const response = await API.get(await url, await expandHeaders(headers), payload);
    return response.data;
};

export const fetchWebRoutesService = (options) => ({
    type: ActionTypes.WEB_ROUTES_SERVICES_FETCH,
    payload: fetchWebRoutesServiceData(ActionTypes.WEB_ROUTES_SERVICES_FETCH_URL, {}, options)
});

const createWebRouteData = async (url, headers, payload) => {
    const response = await API.post(await url, await expandHeaders(headers), payload);
    return response.data;
};

export const createWebRoute = (payload) => ({
    type: ActionTypes.WEB_ROUTE_CREATE,
    payload: createWebRouteData(ActionTypes.WEB_ROUTES_FETCH_URL, {}, payload)
});

const deleteWebRoute = async (headers, id) => {
    await API.delete(`${ActionTypes.WEB_ROUTES_FETCH_URL}/${id}`, await expandHeaders(headers))
        .then(() => {
            successNotification('');
        }, error => {
            errorNotification(error);
        });
};

export const deleteWebRouteAction = (id) => ({
    type: ActionTypes.WEB_ROUTE_DELETE,
    payload: deleteWebRoute({}, id)
});
export const deleteWebRouteReset = () => ({
    type: ActionTypes.WEB_ROUTE_DELETE_RESET
});
const updateWebRouteData = async (headers, data, routeId) => {
    await API.put(`${ActionTypes.WEB_ROUTES_FETCH_URL}/${routeId}`,  data, await expandHeaders(headers))
        .then(() => {
            successNotification('');
        }, error => {
            errorNotification(error);
        });
};

export const updateWebRoute = (data, routeId) => ({
    type: ActionTypes.WEB_ROUTE_UPDATE,
    payload: updateWebRouteData({}, data, routeId)
});

//*Certificates API not working yet
// const fetchCertificatesData = async (url, headers, payload) => {
//     await insights.chrome.auth.getUser();
//     const response = await API.get(await url, await expandHeaders(headers), payload);
//     return response.data;
// };

// export const fetchCertificates = (options) => ({
//     type: ActionTypes.CERTIFICATES_FETCH,
//     payload: fetchCertificatesData(ActionTypes.CERTIFICATES_FETCH_URL, {}, options)
// });

// const createCertificateData = async (url, headers, payload) => {
//     await insights.chrome.auth.getUser();
//     const response = await API.post(await url, await expandHeaders(headers), payload);
//     return response.data;
// };

// export const createCertificate = (payload) => ({
//     type: ActionTypes.CERTIFICATES_FETCH,
//     payload: createCertificateData(ActionTypes.CERTIFICATES_FETCH_URL, {}, payload)
// });

// const deleteCertificate = async (headers, id) => {
//     await insights.chrome.auth.getUser();
//     await API.delete(`${ActionTypes.CERTIFICATES_FETCH_URL}/${id}`, await expandHeaders(headers))
//         .then(() => {
//             successNotification('');
//         }, error => {
//             errorNotification(error);
//         });
// };

// export const deleteCertificateAction = (id) => ({
//     type: ActionTypes.CERTIFICATE_DELETE,
//     payload: deleteCertificate({}, id)
// });

// const updateCertificateData = async (headers, data, certificateId) => {
//     await insights.chrome.auth.getUser();
//     await API.put(`${ActionTypes.CERTIFICATES_FETCH_URL}/${certificateId}`,  data, await expandHeaders(headers))
//         .then(() => {
//             successNotification('');
//         }, error => {
//             errorNotification(error);
//         });
// };

// export const updateCertificate = (data, certificateId) => ({
//     type: ActionTypes.CERTIFICATE_UPDATE,
//     payload: updateCertificateData({}, data, certificateId)
// });

export const updateAccounts = (accounts) => ({
    type: ActionTypes.UPDATE_ACCOUNTS,
    payload: accounts
});

export const changeLang = (newLang) => ({
    type: ActionTypes.CHANGE_LANG,
    payload: newLang
});
