import {
    UPD_ITEMDEF,
    UPD_ITEMCLDF,
    UPD_ITEMDESCRIPTION,
    UPD_NAMELABELWHERECLAUSE,
    ADD_VAR,
    DEL_VARS,
    DEL_CODELISTS,
    DEL_ITEMGROUPS,
    ADD_VALUELIST,
    INSERT_VAR,
    INSERT_VALLVL,
} from "constants/action-types";
import { ItemDef } from 'elements.js';
import deepEqual from 'fast-deep-equal';

const updateItemDef = (state, action) => {
    let newItemDef = new ItemDef({...state[action.oid], ...action.updateObj});
    return { ...state, [action.oid]: newItemDef };
};

const updateItemCodeListDisplayFormat = (state, action) => {
    // If the codeList was removed and lengthAsCodeList is true, set it to false
    let lengthAsCodeList;
    if (action.updateObj.codeListOid === undefined && state[action.oid].lengthAsCodeList === true) {
        lengthAsCodeList = false;
    } else {
        lengthAsCodeList = state[action.oid].lengthAsCodeList;
    }
    let newItemDef = new ItemDef({
        ...state[action.oid],
        codeListOid   : action.updateObj.codeListOid,
        displayFormat : action.updateObj.displayFormat,
        lengthAsCodeList
    });
    return { ...state, [action.oid]: newItemDef };
};

const updateItemDescription = (state, action) => {
    // Check if origin or comment has changed;
    let newState = { ...state };
    let changedFlag = false;
    // Comment
    let previousCommentOid;
    if (action.prevObj.comment !== undefined) {
        previousCommentOid = action.prevObj.comment.oid;
    }
    let newCommentOid;
    if (action.updateObj.comment !== undefined) {
        newCommentOid = action.updateObj.comment.oid;
    }
    if (previousCommentOid !== newCommentOid) {
        newState = { ...state, [action.source.oid]: new ItemDef({ ...newState[action.source.oid], commentOid: newCommentOid }) };
        changedFlag = true;
    }
    // Origin
    if (!deepEqual(action.updateObj.origins, action.prevObj.origins)) {
        newState = { ...state, [action.source.oid]: new ItemDef({ ...newState[action.source.oid], origins: action.updateObj.origins }) };
        changedFlag = true;
    }

    if (changedFlag) {
        return newState;
    } else {
        return state;
    }
};

const updateNameLabel = (state, action) => {
    let newItemDef = new ItemDef({...state[action.source.itemDefOid], ...action.updateObj});
    return { ...state, [action.source.itemDefOid]: newItemDef };
};

const addVariable = (state, action) => {
    return { ...state, [action.itemDef.oid]: action.itemDef };
};

const deleteVariables = (state, action) => {
    // action.deleteObj.itemDefOids: [itemDefOid1, itemDefOid2, ...]
    // action.deleteObj.vlmItemDefOids: { valueListOid1: [itemDefOid1, itemDefOid2, ...], valueListOid2: [itemDefOid3, ...]
    let newState = Object.assign({}, state);
    // First go through itemDefs which are coming from the variable level;
    action.deleteObj.itemDefOids.forEach( itemDefOid => {
        // If it is referened only in 1 dataset, remove it
        let sourceNum = [].concat.apply([],Object.keys(state[itemDefOid].sources).map(type => (state[itemDefOid].sources[type]))).length;
        if (sourceNum === 1
            && state[itemDefOid].sources.itemGroups[0] === action.source.itemGroupOid) {
            delete newState[itemDefOid];
        } else if (state[itemDefOid].sources.itemGroups.includes(action.source.itemGroupOid)) {
            // Delete the dataset from the sources
            let newSourcesForType = state[itemDefOid].sources.itemGroups.slice();
            newSourcesForType.splice(newSourcesForType.indexOf(action.source.itemGroupOid),1);
            newState = { ...newState, [itemDefOid]: new ItemDef({ ...state[itemDefOid], sources: { ...state[itemDefOid].sources, itemGroups: newSourcesForType } }) };
        }
    });
    // Remove value levels
    Object.keys(action.deleteObj.vlmItemDefOids).forEach( valueListOid => {
        action.deleteObj.vlmItemDefOids[valueListOid].forEach( itemDefOid => {
            // If it is referened only in 1 dataset, remove it
            let sourceNum = [].concat.apply([],Object.keys(state[itemDefOid].sources).map(type => (state[itemDefOid].sources[type]))).length;
            if (sourceNum === 1
                && state[itemDefOid].sources.valueLists[0] === valueListOid) {
                delete newState[itemDefOid];
            } else if (state[itemDefOid].sources.valueLists.includes(valueListOid)) {
                // Delete the dataset from the sources
                let newSourcesForType = state[itemDefOid].sources.valueLists.slice();
                newSourcesForType.splice(newSourcesForType.indexOf(valueListOid),1);
                newState = {
                    ...newState,
                    [itemDefOid]: new ItemDef({ ...state[itemDefOid],
                        sources: { ...state[itemDefOid].sources, valueLists: newSourcesForType }
                    })
                };
            }
        });
    });
    // When only value level is removed, delete reference to it
    Object.keys(action.deleteObj.valueListOids).forEach( itemDefOid => {
        if (newState.hasOwnProperty(itemDefOid)) {
            newState = {
                ...newState,
                [itemDefOid]: new ItemDef({ ...state[itemDefOid], valueListOid: undefined })
            };
        }
    });
    return newState;
};

const deleteItemGroups = (state, action) => {
    // action.deleteObj.itemGroupData contains:
    // {[itemGroupOid] : itemDefOids: { [itemOid1, itemOid2, ...]}}
    // {[itemGroupOid] : vlmItemDefOids: { [itemOid1, itemOid2, ...]}}
    // {[itemGroupOid] : valueListOids: { [vlOid1, vlOid2, ...]}}
    let newState = { ...state };
    Object.keys(action.deleteObj.itemGroupData).forEach( itemGroupOid => {
        let subAction = {deleteObj: {}, source: { itemGroupOid }};
        subAction.deleteObj.itemDefOids = action.deleteObj.itemGroupData[itemGroupOid].itemDefOids;
        subAction.deleteObj.vlmItemDefOids = action.deleteObj.itemGroupData[itemGroupOid].vlmItemDefOids;
        subAction.deleteObj.valueListOids = action.deleteObj.itemGroupData[itemGroupOid].valueListOids;
        newState = deleteVariables(newState, subAction);
    });
    return newState;
};

const deleteCodeLists = (state, action) => {
    // action.deleteObj - array of itemOids for which codelists should be removed
    let newState = { ...state };
    action.deleteObj.itemDefOids.forEach( itemDefOid => {
        let newItemDef = new ItemDef({ ...state[itemDefOid], codeListOid: undefined });
        newState = { ...newState, [itemDefOid]: newItemDef };
    });

    return newState;
};

const handleAddValueList = (state, action) => {
    // Create a new itemDef for the valueList
    let newItemDef = new ItemDef({
        oid              : action.itemDefOid,
        sources          : {itemGroups: [], valueLists: [action.valueListOid]},
        parentItemDefOid : action.source.oid,
    });
    // Update existing itemDef to reference VLM
    let parentItemDef = new ItemDef({
        ...state[action.source.oid],
        valueListOid: action.valueListOid,
    });
    return { ...state, [action.itemDefOid]: newItemDef, [action.source.oid]: parentItemDef };
};

const insertVariable = (state, action) => {
    // Create a new itemDef
    let newItemDef = new ItemDef({
        oid     : action.itemDefOid,
        sources : {itemGroups: [action.itemGroupOid], valueLists: []},
    });
    return { ...state, [action.itemDefOid]: newItemDef };
};

const insertValueLevel = (state, action) => {
    // Create a new itemDef
    let newItemDef = new ItemDef({
        oid              : action.itemDefOid,
        sources          : {itemGroups: [], valueLists: [action.valueListOid]},
        parentItemDefOid : action.parentItemDefOid,
    });
    return { ...state, [action.itemDefOid]: newItemDef };
};

const itemDefs = (state = {}, action) => {
    switch (action.type) {
        case UPD_ITEMDEF:
            return updateItemDef(state, action);
        case UPD_ITEMCLDF:
            return updateItemCodeListDisplayFormat(state, action);
        case UPD_ITEMDESCRIPTION:
            return updateItemDescription(state, action);
        case UPD_NAMELABELWHERECLAUSE:
            return updateNameLabel(state, action);
        case ADD_VAR:
            return addVariable(state, action);
        case DEL_VARS:
            return deleteVariables(state, action);
        case DEL_ITEMGROUPS:
            return deleteItemGroups(state, action);
        case DEL_CODELISTS:
            return deleteCodeLists(state, action);
        case ADD_VALUELIST:
            return handleAddValueList(state, action);
        case INSERT_VAR:
            return insertVariable(state, action);
        case INSERT_VALLVL:
            return insertValueLevel(state, action);
        default:
            return state;
    }
};

export default itemDefs;