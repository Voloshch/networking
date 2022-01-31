//import { validationMessages } from '../AppConstants';
//let locale = localStorage.getItem('icdc-lang') || 'en';

const MIN_PORT = 0;
const MAX_PORT = 65535;

const validateTranclations = {
    en: {
        required: 'Required',
        number: 'Must be a number',
        minLength: (min) => `Must be ${min} characters or more`,
        maxLength: (max) => `Must be ${max} characters or less`,
        name: 'Name',
        nameWithoutDotsOrAt: 'Please, enter "@" or name constiting of latin letters (a-z), numbers (0-9), dashes, and/or underscores',
        ip: 'Please enter a valid subnet',
        hostname: 'Sorry, only Latin letters (a-z), numbers (0-9), dashes, “_”, dots are allowed',
        port: 'Please enter valid port or port range',
        ttl: 'Sorry, TTL must be a number',
        ipOrHostname: 'Please enter a valid IP address or hostname'
    },
    ru: {
        required: 'Обязательно для заполнения',
        number: 'Должно быть число',
        minLength: (min) => `Должно быть ${min} символов или больше`,
        maxLength: (max) => `Должно быть ${max} символов или меньше`,
        name: 'Имя',
        nameWithoutDotsOrAt: 'Введите "@" или имя, состоящее из латинских букв (a-z), цифр (0-9), дефисов, и/или «_»',
        ip: 'Введите действительный IP-адресс',
        hostname: 'Извините, разрешены только латинские буквы (a-z), цифры (0-9), тире, «_» и точки',
        port: 'Укажите верное значение порта или диапазона портов',
        ttl: 'Извините, TTL должен быть числом (0-9)',
        ipOrHostname: 'Введите действительный IP-адреc или hostname'
    }
};

const getLang = () => {
    return localStorage.getItem('icdc-lang') || 'en';
};

export const required = value => value ? undefined : validateTranclations[getLang()].required;

/**
 * Checks if the value is a number
 * @returns If it's a number then it will return undefined, if not it will return an error
 */
export const number = (value) => {
    return /^\d+$/.test(value) ? undefined : validateTranclations[getLang()].number;
};

export const minLength = min => value => (
    value && value.length < min ? validateTranclations[getLang()].minLength(min) : undefined);

const maxLength = max => value => (
    value && value.length > max ? validateTranclations[getLang()].maxLength(max) : undefined);

export const maxLength5 = maxLength(5);

export const maxLength15 = maxLength(15);

export const maxLength30 = maxLength(30);

export const maxLength63 = maxLength(63);

export const maxLength250 = maxLength(250);

export const maxLength256 = maxLength(256);

export const name = value => (
    value && !value.match(/^[a-zA-Z0-9_.-]*$/) ?
        validateTranclations[getLang()].name :
        undefined
);

export const nameWithoutDotsOrAt = value => (
    value && !value.match(/^[a-zA-Z0-9_-]*$|^@$/) ? validateTranclations[getLang()].nameWithoutDotsOrAt : undefined
);

export const hostname = value => {
    const hostnameRegex = /^[a-zA-Z0-9_.-]*$/;

    return value && !value.match(hostnameRegex) ?
        validateTranclations[getLang()].hostname :
        undefined;
};

export const dns = value => {
    let flag = 0;
    if (value.match(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\/[0-9]{1,2}$/)) {
        let dnsParts = value.split(/\.|\//);
        dnsParts.forEach((num, index) => {
            let condition = (min, max) => num >= min && num <= max;
            if (index < 4 && condition(0, 255) || index === 4 && condition(0, 32)) {
                flag++;
            }
        });
    }

    return flag === 5 ? undefined : 'DNS';
};

export const ip = value => {
    let flag = 0;
    if (typeof value === 'string' && value.match(/^[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}$/)) {
        let dnsParts = value.split(/\./);
        dnsParts.forEach((num) => {
            let condition = (min, max) => num >= min && num <= max;
            if (condition(0, 255)) {
                flag++;
            }
        });
    }

    return flag === 4 ? undefined : validateTranclations[getLang()].ip;
};

export const ipv6 = value => {
    // eslint-disable-next-line max-len
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

    return value && !value.match(ipv6Regex) ?
        validateTranclations[getLang()].ip : undefined;
};

/**
 * Checks if the format of the input is corresponding to the IPV4 format or is empty
 * @returns Undefined on success, or Error message
 */
export const dnsOrEmpty = value => {
    return value === '' || value === null || dns(value) === undefined ? undefined : validateTranclations[getLang()].ip;
};

/**
 * Checks if the format of the input is corresponding to the IPV6 format or is empty
 * @returns Undefined on success, or Error message
 */
export const ipv6OrEmpty = value => {
    const subnetValue = value.split('/')[1] !== '' ? value.split('/')[1] : 'invalid';

    const isValidSubnetValue = value.includes('/') &&
        number(subnetValue) === undefined &&
        subnetValue <= 128 ?
        undefined : 'invalid';

    return (value === '' ||
        value === null ||
        ipv6(value.split('/')[0]) === undefined &&
        isValidSubnetValue === undefined) ?
        undefined : validateTranclations[getLang()].ip;
};

/**
 * Checks if the value is between 0 and 65536
 * @returns Undefined on success, or Error message
 */
export const port = value => (
    value &&
        number(value) &&
        value < MIN_PORT ||
        value > MAX_PORT ?
        validateTranclations[getLang()].port : undefined
);

/**
 * Checks if the input is valid
 * @returns Undefined on success, or Error message
 */
export const ports = value => {
    const splitedValue = value.replace(/\s/g, '').split('-'); // remove any white space and split by -
    const leftValue = splitedValue[0] || '';
    const rightValue = splitedValue[1] || '';
    const containsDash = value.includes('-');

    //There can only be 0-65536, 123-123, 123 and left < right
    const numbersOnly = number(leftValue) === undefined && number(rightValue) === undefined;
    const leftLessThanRight = splitedValue.length > 1 && parseInt(leftValue) <= parseInt(rightValue) ;
    const inRangeLeftValue = (parseInt(leftValue) >= 0 && parseInt(leftValue) <= 65535);
    const inRangeBothValues = inRangeLeftValue && parseInt(rightValue) >= 0 && parseInt(rightValue) <= 65535;

    if (value !== '' && value !== null) {
        if (containsDash && rightValue === '') {
            return validateTranclations[getLang()].number;
        }

        if (containsDash && rightValue !== '') {
            return numbersOnly && leftLessThanRight && inRangeBothValues ? undefined : validateTranclations[getLang()].number;
        } else {
            return number(leftValue) === undefined && inRangeLeftValue ? undefined : validateTranclations[getLang()].number;
        }
    }
};

export const ttl = value => (
    value && !value.match(/^[0-9]+$/) ?
        validateTranclations[getLang()].ttl : undefined
);

export const targetHostname = value => {
    return ip(value) && hostname(value) && ipv6(value) ? validateTranclations[getLang()].ipOrHostname : undefined;
};

export const priority = value => (
    value !== '' && value !== undefined && !/^\d+$/.test(value) ? validateTranclations[getLang()].number : undefined
);
