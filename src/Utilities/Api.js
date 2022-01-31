import axios from 'axios';

export default {
    get(url, headers = {}, params = {}) {
        switch (url) {
        case 'networks': {
            return { data:
                [{
                    id: 1,
                    title: 'Title1',
                    subtitle: 'Subtitle1',
                    subnet: '11.111.111.11/12',
                    type: 'IPv4',
                    dns: '11.111.111.11/12',
                    ip: '2.2.2.22'
                },
                {
                    id: 2,
                    title: 'Title2',
                    subtitle: 'Subtitle2',
                    subnet: '11.111.111.11/12',
                    type: 'IPv4',
                    dns: '11.111.111.11/12',
                    ip: '11.111.111.11/12'
                }]
            };
        }

        case 'networks/1': {
            return { data:
                {
                    id: 1,
                    title: 'Title1',
                    subtitle: 'Subtitle1',
                    subnet: '11.111.111.11/12',
                    type: 'IPv4',
                    dns: '11.111.111.11/12',
                    ip: '2.2.2.22'
                }
            };
        }

        // case 'api/network_routers?expand=resources': {
        //     debugger; // eslint-disable-line no-debugger
        //     return {
        //         resources: [{
        //             /* eslint-disable camelcase */
        //             extra_attributes: {
        //                 routes: [{
        //                     nexthop: '10.230.1.7',
        //                     destination: '10.253.0.0/16'
        //                 }, {
        //                     nexthop: '10.230.1.6',
        //                     destination: '10.254.57.0/24'
        //                 }
        //                 ]
        //             }
        //         }
        //         ]
        //     };
        // }

        default: {
            return axios.get(url, {
                headers,
                params
            });
        }
        }
    },
    put(url, data = {}, headers = {}) {
        return axios.put(url, data, {
            headers
        });
    },
    post(url, headers = {}, data = {}) {
        return axios.post(url, data, {
            headers
        });
    },
    delete(url, headers = {}) {
        return axios.delete(url, {
            headers
        });
    }
};
