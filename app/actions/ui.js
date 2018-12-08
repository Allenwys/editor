import {
    UI_CHANGETAB,
    UI_CHANGEPAGE,
    UI_TOGGLEROWSELECT,
    UI_SETVLMSTATE,
    UI_SELECTGROUP,
    UI_SELECTCOLUMNS,
    UI_TOGGLEMAINMENU,
    UI_SETSTUDYORDERTYPE,
    UI_TOGGLEADDDEFINEFORM,
    UI_UPDATEFILTER,
    UI_LOADTABS,
    UI_OPENMODAL,
    UI_CLOSEMODAL,
    UI_UPDMAIN,
    UI_TOGGLEREVIEWMODE,
    UI_UPDCOPYBUFFER,
    UI_CHANGETABLEPAGEDETAILS,
} from 'constants/action-types';

export const changeTab = updateObj => ({
    type: UI_CHANGETAB,
    updateObj
});

export const changePage = updateObj => ({
    type: UI_CHANGEPAGE,
    updateObj
});

export const toggleRowSelect = source => ({
    type: UI_TOGGLEROWSELECT,
    source
});

export const setVlmState = (source, updateObj) => ({
    type: UI_SETVLMSTATE,
    source,
    updateObj
});

export const selectGroup = updateObj => ({
    type: UI_SELECTGROUP,
    updateObj
});

export const selectColumns = updateObj => ({
    type: UI_SELECTCOLUMNS,
    updateObj
});

export const toggleMainMenu = () => ({
    type: UI_TOGGLEMAINMENU
});

export const setStudyOrderType = updateObj => ({
    type: UI_SETSTUDYORDERTYPE,
    updateObj
});

export const toggleAddDefineForm = updateObj => ({
    type: UI_TOGGLEADDDEFINEFORM,
    updateObj
});

export const changeTablePageDetails = updateObj => ({
    type: UI_CHANGETABLEPAGEDETAILS,
    updateObj
});

export const updateFilter = updateObj => ({
    type: UI_UPDATEFILTER,
    updateObj
});

export const loadTabs = updateObj => ({
    type: UI_LOADTABS,
    updateObj
});

export const openModal = updateObj => ({
    type: UI_OPENMODAL,
    updateObj
});

export const closeModal = () => ({
    type: UI_CLOSEMODAL,
});

export const updateMainUi = updateObj => ({
    type: UI_UPDMAIN,
    updateObj
});

export const toggleReviewMode = () => ({
    type: UI_TOGGLEREVIEWMODE,
});

export const updateCopyBuffer = updateObj => ({
    type: UI_UPDCOPYBUFFER,
    updateObj
});
