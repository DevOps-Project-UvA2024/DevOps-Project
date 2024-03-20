import http from 'k6/http';
import { check, sleep } from 'k6';

export const scenarios = {
    loginFlow: {
        executor: 'ramping-vus',
        exec: 'loginFlow',
        startVUs: 0,
        stages: [
            { duration: '5m', target: 1000 },
            { duration: '5m', target: 1000 },
            { duration: '5m', target: 0 },
        ],
        gracefulRampDown: '60s',
    },
    resourceDownloadFlow: {
        executor: 'ramping-vus',
        exec: 'resourceDownloadFlow',
        startVUs: 0,
        stages: [
            { duration: '5m', target: 300 },
            { duration: '5m', target: 300 },
            { duration: '5m', target: 0 },
        ],
        gracefulRampDown: '60s',
    },
    resourceVoteFlow: {
        executor: 'ramping-vus',
        exec: 'resourceVoteFlow',
        startVUs: 0,
        stages: [
            { duration: '5m', target: 1000 },
            { duration: '5m', target: 1000 },
            { duration: '5m', target: 0 },
        ],
        gracefulRampDown: '60s',
    }
};

export const options = {
    scenarios: {}
};

if (__ENV.scenario) {
    options.scenarios[__ENV.scenario] = scenarios[__ENV.scenario];
} else {
    options.scenarios = scenarios;
}

export function setup() {
    let loginRes = login()
    check(loginRes, {
        'logged in successfully': r => r.status === 200,
        'cookie is set': r => r.cookies['accessToken'] !== undefined,
    });
    sleep(1);
}

export function loginFlow() {
    let res = http.get('http://eduapp-alb-708465632.eu-north-1.elb.amazonaws.com/signin');
    check(res, { 'Visited login page': (r) => r.status === 200 });

    sleep(1);
}

export function resourceDownloadFlow() {

    let resourceRes = http.get('http://eduapp-alb-708465632.eu-north-1.elb.amazonaws.com/api/files/download/dimitris/1710936137197/Cost.csv');
    check(resourceRes, { 'Resource downloaded successfully': (r) => r.status === 401 });
    sleep(1);
}

export function resourceVoteFlow() {
    
    let data = { 
        rating: 4
    };
    let resourceRes = http.post('http://eduapp-alb-708465632.eu-north-1.elb.amazonaws.com/api/files/rating/1',
    JSON.stringify(data), 
    {
        headers: { 'Content-Type': 'application/json' }
    });
    check(resourceRes, { 'Voted successfully': (r) => r.status === 401 });
    sleep(1);
}

function login() {
    let data = { 
        username: 'dimitris.bratsos@student.uva.nl',
        password: 'REMOVED FOR SECURITY REASONS'
    };

    return http.post('http://eduapp-alb-708465632.eu-north-1.elb.amazonaws.com/api/users/auth/signin',
    JSON.stringify(data), 
    {
        headers: { 'Content-Type': 'application/json' }
    });
}
