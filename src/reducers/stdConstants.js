import {
    ADD_STDCONST
} from '../constants/action-types';
import columns from 'constants/columns';

const dataTypes = [
    'text',
    'integer',
    'float',
    'date',
    'datetime',
    'time',
    'partialDate',
    'partialTime',
    'partialDatetime',
    'incompleteDatetime',
    'durationDatetime',
];

const codeListTypes =  [
    {'enumerated': 'Enumeration'},
    {'decoded': 'Decoded'},
    {'external': 'External'},
];

const standardNames = {
    '2.0.0': [
        'SDTM-IG',
        'SDTM-IG-MD',
        'SDTM-IG-AP',
        'SDTM-IG-PGx',
        'SEND-IG',
        'SEND-IG-DART',
        'ADaM-IG',
    ],
    '2.1.0': [
        'SDTMIG',
        'SDTMIG-MD',
        'SDTMIG-AP',
        'SDTMIG-PGx',
        'SENDIG',
        'SENDIG-DART',
        'ADaMIG',
    ],
};

const originTypes = {
    'ADaM': [
        'Derived',
        'Assigned',
        'Predecessor'
    ],
    'SDTM': [
        'CRF',
        'Derived',
        'Assigned',
        'Protocol',
        'eDT',
        'Predecessor'
    ],
    'SEND': [
        'CRF',
        'Derived',
        'Assigned',
        'Protocol',
        'eDT',
        'Predecessor'
    ],
};

const typeLabel = {
    annotatedCrf    : 'Annotated CRF',
    supplementalDoc : 'Supplemental Document',
    other           : 'Other',
};

const typeOrder = {
    annotatedCrf    : 1,
    supplementalDoc : 2,
    other           : 3,
};

const documentTypes = {
    typeOrder,
    typeLabel,
};

const initialState = {
    dataTypes,
    codeListTypes,
    standardNames,
    documentTypes,
    columns,
    originTypes,
};

const stdConstants = (state = initialState, action) => {
    switch (action.type) {
        case ADD_STDCONST:
            return initialState;
        default:
            return state;
    }
};

export default stdConstants;
