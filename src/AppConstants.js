/* eslint-disable max-len */
import { createIntl, createIntlCache } from 'react-intl';

import messages from './Messages';
import messagesLocale from '../locales/data';

const cache = createIntlCache();
const locale = localStorage.getItem('icdc-lang') || 'en';
const intl = createIntl({
    // eslint-disable-next-line no-console
    onError: console.log,
    locale,
    messages: messagesLocale[locale]
}, cache);

export const NETWORKS_FETCH = 'NETWORKS_FETCH';
export const NETWORKS_FETCH_URL = `/cloud_networks?expand=resources&attributes=cloud_subnets,custom_attributes`;
export const NETWORK_FETCH = 'NETWORK_FETCH';
export const NETWORK_DELETE = 'NETWORK_DELETE';
export const NETWORK_CREATE = 'NETWORK_CREATE';
export const NETWORK_EDIT = 'NETWORK_EDIT';
export const ASSIGNED_VMS_FETCH = 'ASSIGNED_VMS_FETCH';
export const NETWORK_TEMP_ADD = 'NETWORK_TEMP_ADD';
export const NETWORK_TEMP_REMOVE = 'NETWORK_TEMP_REMOVE';

export const ROUTES_FETCH = 'ROUTES_FETCH';
export const ROUTES_FETCH_URL = `/network_routers?expand=resources`;
export const ROUTE_DELETE = 'ROUTE_DELETE';
export const ROUTE_CREATE = 'ROUTE_CREATE';

export const SECURITY_GROUPS_FETCH = 'SECURITY_GROUPS_FETCH';
export const SECURITY_GROUPS_FETCH_URL = `/security_groups?expand=resources&attributes=firewall_rules,assigned_vms`;
export const SECURITY_GROUP_FETCH = 'SECURITY_GROUP_FETCH';
export const SECURITY_GROUP_CREATE = 'SECURITY_GROUP_CREATE';
export const SECURITY_GROUP_DELETE = 'SECURITY_GROUP_DELETE';
export const SECURITY_GROUP_LOADER = 'SECURITY_GROUP_LOADER';
export const SECURITY_GROUP_EDIT = 'SECURITY_GROUP_EDIT';
export const ASSIGN_NICS_TO_SECURITY_GROUP = 'ASSIGN_NICS_TO_SECURITY_GROUP';
export const UNASSIGN_NICS_FROM_SECURITY_GROUP = 'UNASSIGN_NICS_FROM_SECURITY_GROUP';

export const RULE_DELETE = 'RULE_DELETE';
export const RULE_EDIT = 'RULE_EDIT';
export const RULE_CREATE = 'RULE_CREATE';
export const SECURITY_GROUP_TEMP_ADD = 'SECURITY_GROUP_TEMP_ADD';

export const USER_UPDATE = 'USER_UPDATE';
export const ROLE_UPDATE = 'ROLES_UPDATE';
export const ACCOUNT_UPDATE = 'ACCOUNT_UPDATE';
export const LOCATION_UPDATE = 'LOCATION_UPDATE';
export const TOKEN_UPDATE = 'TOKEN_UPDATE';
export const CHANGE_LANG = 'CHANGE_LANG';
export const UPDATE_ACCOUNTS = 'UPDATE_ACCOUNTS';

export const ASSIGNED_VMS = `/cloud_subnets?expand=resources&attributes=assigned_vms`;
export const PROVIDER_ID_URL = `/providers?expand=resources&filter[]=type=ManageIQ::Providers::Redhat::NetworkManager`;
export const PROVIDER_ID_FETCH = 'PROVIDER_ID_FETCH';

export const ALL_VMS_FETCH = 'ALL_VMS_FETCH';
export const ALL_VMS_URL = `/vms?expand=resources&attributes=nics,service.name&filter[]=retirement_state=nil`;

export const WEB_ROUTES_FETCH = 'WEB_ROUTES_FETCH';
export const WEB_ROUTE_FETCH = 'WEB_ROUTE_FETCH';
export const WEB_ROUTES_SERVICES_FETCH = 'WEB_ROUTES_SERVICES_FETCH';

//!url
export const WEB_ROUTES_FETCH_URL = `http://localhost:3000/api/v1/routes`;
export const WEB_ROUTES_SERVICES_FETCH_URL = `http://localhost:3000/api/v1/services`;
export const WEB_ROUTE_DELETE = 'WEB_ROUTE_DELETE';
export const WEB_ROUTE_DELETE_RESET = 'WEB_ROUTE_DELETE_RESET';
export const WEB_ROUTE_CREATE = 'WEB_ROUTE_CREATE';
export const WEB_ROUTE_UPDATE = 'WEB_ROUTE_UPDATE';

export const CERTIFICATES_FETCH = 'CERTIFICATES__FETCH';
//!url
export const CERTIFICATES_FETCH_URL = `http://localhost:3000/api/v1/certificates`;
export const CERTIFICATE_DELETE = 'CERTIFICATES__DELETE';
export const CERTIFICATE_CREATE = 'CERTIFICATES__CREATE';
export const CERTIFICATE_UPDATE = 'CERTIFICATE_UPDATE';

export const getSecurityGroup = (id) => `/security_groups/${id}?expand=resources&attributes=firewall_rules,assigned_vms`;
export const routerUrl = (id) => `/network_routers/${id}`;
export const securityGroupsUrl = (id) => `/providers/${id}/security_groups`;
export const securityGroupUrl = (id) => `/security_groups/${id}`;
export const ruleUrl = (id) => `/security_groups/${id}`;
export const currentNetwork = (id) => `/cloud_subnets/${id}?expand=resources&attributes=assigned_vms,network_ports,cloud_network.name,cloud_network.custom_attributes`;
export const networksUrl = (id) => `/providers/${id}/cloud_networks/`;
export const networkUrl = (providerId) => `/providers/${providerId}/cloud_networks`;
export const dnsZoneUrl = (zoneName) => `/zones/${zoneName}`;
export const dnsZoneRecordsUrl = (zoneName) => `/zones/${zoneName}/records`;
export const dnsZoneRecordUrl = (zoneName, recordId, recordName) => {
    const formatRecordUrl = recordId ? `${recordId}.${recordName}` : `${recordName}`;
    return `/zones/${zoneName}/records/${formatRecordUrl}`;
};

// export const DNS_ZONE_WITH_NICS = '/zones?expand=resources&attributes=property_attributes,property_associations';
export const DNS_ZONE_URL = '/zones';
export const DNS_ZONE_FETCH = 'DNS_ZONE_FETCH';
export const DNS_ZONE_CREATE = 'DNS_ZONE_CREATE';
export const DNS_ZONE_DELETE = 'DNS_ZONE_DELETE';

export const DNS_ZONE_RECORDS_URL = '/zones/zby.icdc.io/records';
export const DNS_ZONE_RECORDS_FETCH = 'DNS_ZONES_REC_FETCH';
export const DNS_ZONE_RECORDS_CREATE = 'DNS_ZONES_RECORDS_CREATE';
export const DNS_ZONE_RECORDS_DELETE = 'DNS_ZONES_RECORDS_DELETE';

export const notificationMessages = {
    ru: {
        error: 'Ошибка! ',
        success: 'Успешно! ',
        sgNotExist: 'Группы безопасности с таким ID не существует',
        ruleEditError: 'Ошибка при редактировании правила',
        routerNotExist: 'Сетевого маршрутизатора с таким ID не существует',
        unauthorized: 'Пользователь не авторизирован',
        // removalProcessStarted: 'Процесс удаления запущен',
        cannotDeleteGroupWithAssignedVmsNics: `Невозможно удалить группу безопасности с назначенными NICs`,
        ruleAlreadyExists: 'Правило уже существует'
    },
    en: {
        error: 'Error! ',
        success: 'Success! ',
        sgNotExist: 'Could not find Security group with such ID',
        ruleEditError: 'Firewall rule edit error',
        routerNotExist: 'Could not find Network router with such ID',
        unauthorized: 'Unauthorized',
        cannotDeleteGroupWithAssignedVmsNics: `Can't delete security group with assigned NICs`,
        // removalProcessStarted: 'The deletion process has started',
        ruleAlreadyExists: 'Rule already exists'
    }
};

export const usersS3columns = {
    name: intl.formatMessage(messages.name),
    description: intl.formatMessage(messages.description),
    space: intl.formatMessage(messages.space),
    buckets: intl.formatMessage(messages.buckets),
    objects: intl.formatMessage(messages.objects)
};

export const validationMessages = {
    required: intl.formatMessage(messages.required),
    number: intl.formatMessage(messages.numberValidation),
    minLength: (min) => intl.formatMessage(messages.minLength, { min })
};

export const dnsFields = {
    name: 'name',
    ipv4: 'ipv4',
    ttl: 'ttl',
    ipv6: 'ipv6',
    text: 'text',
    priority: 'priority',
    port: 'port',
    weight: 'weight',
    hostname: 'hostname',
    targetHostname: 'targetHostname'
};
