import { Document } from 'elements.js';
import {
    UPD_LEAFS,
} from "../constants/action-types";

// This reducer does not bring additional value as there is a non-standard type attribute added for leafs, which controls whether
// a document is SupplementalDoc or AnnotatedCRF. So this object duplicates this information.
// This reducer is created to keep consistency with the original Define-XML structure.

const initialState = {};

const updateAnnotatedCrf = (state, action) => {
    let newState = { ...state };
    // action.updateObj.removedLeafIds - list of removed leaf OIDs
    // action.updateObj.addedLeafs - list of added leafs
    // action.updateObj.updatedLeafs - list of changed leafs
    let updateObj = action.updateObj;
    updateObj.removedLeafIds.forEach( leafId => {
        if (newState.hasOwnProperty(leafId)) {
            delete newState[leafId];
        }
    });
    Object.keys(updateObj.addedLeafs)
        .filter( leafId => (updateObj.addedLeafs[leafId].type === 'annotatedCrf') )
        .forEach( leafId => {
            newState[leafId] = new Document({ leafId: leafId });
        });
    // If the type was changed to annotatedCrf
    Object.keys(updateObj.updatedLeafs)
        .filter( leafId => (updateObj.updatedLeafs[leafId].type === 'annotatedCrf' && !newState.hasOwnProperty(leafId)) )
        .forEach( leafId => {
            newState[leafId] = new Document({ leafId: leafId });
        });
    // If the type was changed from annotatedCrf to something else
    Object.keys(updateObj.updatedLeafs)
        .filter( leafId => (updateObj.updatedLeafs[leafId].type !== 'annotatedCrf' && newState.hasOwnProperty(leafId)) )
        .forEach( leafId => {
            delete newState[leafId];
        });
    return newState;
};

const annotatedCrf = (state = initialState, action) => {
    switch (action.type) {
        case UPD_LEAFS:
            return updateAnnotatedCrf(state, action);
        default:
            return state;
    }
};

export default annotatedCrf;
