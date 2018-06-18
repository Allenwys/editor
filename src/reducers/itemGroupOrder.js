import {
    ADD_ITEMGROUP,
    DEL_ITEMGROUPS,
    UPD_ITEMGROUPORDER,
} from "constants/action-types";

const addItemGroup = (state, action) => {
    let newState = state.slice();
    newState.push(action.itemGroup.oid);
    return newState;
};

const updateItemGroupOrder = (state, action) => {
    let newState = action.itemGroupOrder.slice();
    return newState;
};

const deleteItemGroups = (state, action) => {
    // action.deleteObj.itemGroupOids - oids to remove;
    let newItemGroupOrder = state.slice();
    action.deleteObj.itemGroupOids.forEach( itemGroupOid => {
        newItemGroupOrder.splice(newItemGroupOrder.indexOf(itemGroupOid),1);
    });

    return newItemGroupOrder;
};

const itemGroupOrder = (state = {}, action) => {
    switch (action.type) {
        case ADD_ITEMGROUP:
            return addItemGroup(state, action);
        case DEL_ITEMGROUPS:
            return deleteItemGroups(state, action);
        case UPD_ITEMGROUPORDER:
            return updateItemGroupOrder(state, action);
        default:
            return state;
    }
};

export default itemGroupOrder;
