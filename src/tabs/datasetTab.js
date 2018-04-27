import {BootstrapTable, ButtonGroup} from 'react-bootstrap-table';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import renderColumns from 'utils/renderColumns.js';
import getItemGroupOrder from 'utils/getItemGroupOrder.js';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import React from 'react';
import green from 'material-ui/colors/green';
import indigo from 'material-ui/colors/indigo';
import grey from 'material-ui/colors/grey';
import CommentEditor from 'editors/commentEditor.js';
import AddDatasetEditor from 'editors/addDatasetEditor.js';
import LeafEditor from 'editors/leafEditor.js';
import SimpleInputEditor from 'editors/simpleInputEditor.js';
import SimpleSelectEditor from 'editors/simpleSelectEditor.js';
import DatasetFlagsEditor from 'editors/datasetFlagsEditor.js';
import DatasetFlagsFormatter from 'formatters/datasetFlagsFormatter.js';
import { updateItemGroup, updateItemGroupComment, addItemGroupComment, deleteItemGroupComment } from 'actions/index.js';

// Selector constants
const classTypes = [
    'BASIC DATA STRUCTURE',
    'OCCURRENCE DATA STRUCTURE',
    'SUBJECT LEVEL ANALYSIS DATASET',
    'ADAM OTHER',
    'INTEGRATED BASIC DATA STRUCTURE',
    'INTEGRATED OCCURRENCE DATA STRUCTURE',
    'INTEGRATED SUBJECT LEVEL',
];
const classTypeAbbreviations = {
    'BASIC DATA STRUCTURE'                 : 'BDS',
    'OCCURRENCE DATA STRUCTURE'            : 'OCCDS',
    'SUBJECT LEVEL ANALYSIS DATASET'       : 'ADSL',
    'ADAM OTHER'                           : 'Other',
    'INTEGRATED BASIC DATA STRUCTURE'      : 'IBDS',
    'INTEGRATED OCCURRENCE DATA STRUCTURE' : 'IOCCDS',
    'INTEGRATED SUBJECT LEVEL'             : 'IADSL',
};


// Redux functions
const mapDispatchToProps = dispatch => {
    return {
        updateItemGroup        : (oid, updateObj) => dispatch(updateItemGroup(oid, updateObj)),
        addItemGroupComment    : (source, comment) => dispatch(addItemGroupComment(source, comment)),
        updateItemGroupComment : (source, comment) => dispatch(updateItemGroupComment(source, comment)),
        deleteItemGroupComment : (source, comment) => dispatch(deleteItemGroupComment(source, comment)),
    };
};

const mapStateToProps = state => {
    return {
        itemGroups : state.odm.study.metaDataVersion.itemGroups,
        itemDefs   : state.odm.study.metaDataVersion.itemDefs,
        comments   : state.odm.study.metaDataVersion.comments
    };
};

// Debug options
const hideMe = false;

// Editor functions
function commentEditor (onUpdate, props) {
    return (<CommentEditor onUpdate={ onUpdate } {...props} comment={props.defaultValue} autoFocus={true}/>);
}

function leafEditor (onUpdate, props) {
    return (<LeafEditor onUpdate={ onUpdate } {...props}/>);
}

function datasetFlagsEditor (onUpdate, props) {
    return (<DatasetFlagsEditor onUpdate={ onUpdate } {...props}/>);
}

function simpleInputEditor (onUpdate, props) {
    return (<SimpleInputEditor onUpdate={ onUpdate } {...props}/>);
}

function simpleSelectEditor (onUpdate, props) {
    return (<SimpleSelectEditor onUpdate={ onUpdate } {...props}/>);
}

// Formatter functions
function commentFormatter (cell, row) {
    if (cell !== undefined && cell !== '') {
        return (<span>{cell.toString()}</span>);
    } else {
        return;
    }
}

function leafFormatter (cell, row) {
    if (cell !== undefined && cell !== '') {
        return (<a href={'file://' + cell.href}>{cell.title}</a>);
    } else {
        return;
    }
}

function datasetFlagsFormatter (cell, row) {
    return (<DatasetFlagsFormatter value={cell} defineVersion={row.defineVersion}/>);
}

function datasetClassFormatter (cell, row) {
    let value = classTypeAbbreviations[cell];
    return (<span>{value}</span>);
}

class ConnectedDatasetTable extends React.Component {

    onBeforeSaveCell = (row, cellName, cellValue) => {
        // Update on if the value changed
        if (row[cellName] !== cellValue) {
            let updateObj = {};
            if (cellName === 'flags'){
                updateObj = cellValue;
            } else {
                updateObj[cellName] = cellValue;
            }

            if (cellName === 'comment') {
                if (cellValue === undefined) {
                    // If comment was removed
                    this.props.deleteItemGroupComment({type: 'itemGroups', oid: row.oid}, row.comment);
                } else if (row[cellName] === undefined) {
                    // If comment was added
                    this.props.addItemGroupComment({type: 'itemGroups', oid: row.oid}, cellValue);
                } else {
                    this.props.addItemGroupComment({type: 'itemGroups', oid: row.oid}, cellValue);
                }
            } else {
                this.props.updateItemGroup(row.oid,updateObj);
            }
            return true;
        } else {
            return false;
        }
    }

    createCustomButtonGroup = props => {
        return (
            <ButtonGroup className='my-custom-class' sizeClass='btn-group-md'>
                <Grid container spacing={16}>
                    <Grid item>
                        { props.showSelectedOnlyBtn }
                    </Grid>
                    <Grid item>
                        <AddDatasetEditor/>
                    </Grid>
                    <Grid item>
                        <Button color='default' mini onClick={console.log}
                            variant='raised'>
                            Copy
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button color='primary' mini onClick={console.log} style={{backgroundColor: green[400]}}
                            variant='raised'>
                            Update
                        </Button>
                    </Grid>
                    <Grid item>
                        { props.deleteBtn }
                    </Grid>
                </Grid>
            </ButtonGroup>
        );
    }

    createCustomToolBar = props => {
        return (
            <Grid container spacing={16} justify='space-between'>
                <Grid item style={{paddingLeft: '8px'}}>
                    { props.components.btnGroup }
                </Grid>
                <Grid item style={{paddingRight: '25px'}}>
                    { props.components.searchPanel }
                </Grid>
            </Grid>
        );
    }

    createCustomInsertButton = (openModal) => {
        return (
            <Button color='primary' mini onClick={openModal} variant='raised'>Add</Button>
        );
    }

    createCustomDeleteButton = (onBtnClick) => {
        return (
            <Button color='secondary' mini onClick={onBtnClick} variant='raised'>Delete</Button>
        );
    }

    render () {
        let datasets = [];
        // Extract data required for the dataset table
        getItemGroupOrder(this.props.itemGroups).forEach((itemGroupOid, index) => {
            const originDs = this.props.itemGroups[itemGroupOid];
            let currentDs = {
                oid           : originDs.oid,
                name          : originDs.name,
                datasetClass  : originDs.datasetClass,
                purpose       : originDs.purpose,
                structure     : originDs.structure,
                defineVersion : this.props.defineVersion,
            };
            currentDs.description = originDs.getDescription();
            currentDs.comment = originDs.commentOid === undefined ? undefined : this.props.comments[originDs.commentOid];
            currentDs.leaf = originDs.leaf === undefined ? undefined : originDs.leaf.clone();
            // Group Repeating/IsReferenceData/isStandard
            currentDs.flags = {
                repeating       : originDs.repeating,
                isReferenceData : originDs.isReferenceData,
            };
            // Get key variables
            // TODO: When key is located in the SUPP dataset.
            currentDs.keys = originDs.keyOrder.map( keyOid => {
                return this.props.itemDefs[originDs.itemRefs[keyOid].itemOid].name;
            }).join(', ');
            datasets[index] = currentDs;
        });

        // Editor settings
        const cellEditProp = {
            mode           : 'dbclick',
            blurToSave     : true,
            beforeSaveCell : this.onBeforeSaveCell
        };

        const selectRowProp = {
            mode: 'checkbox'
        };

        const options = {
            toolBar   : this.createCustomToolBar,
            deleteBtn : this.createCustomDeleteButton,
            btnGroup  : this.createCustomButtonGroup
        };

        const columns = [
            {
                dataField : 'oid',
                isKey     : true,
                hidden    : true,
                text      : 'OID',
                editable  : false
            },
            {
                dataField    : 'name',
                text         : 'Name',
                width        : '110px',
                hidden       : hideMe,
                customEditor : {getElement: simpleInputEditor},
                tdStyle      : {whiteSpace: 'normal'},
                thStyle      : {whiteSpace: 'normal'}
            },
            {
                dataField    : 'description',
                text         : 'Description',
                hidden       : hideMe,
                customEditor : {getElement: simpleInputEditor},
                tdStyle      : { whiteSpace: 'normal' },
                thStyle      : { whiteSpace: 'normal' }
            },
            {
                dataField    : 'datasetClass',
                text         : 'Class',
                hidden       : hideMe,
                width        : '7%',
                dataFormat   : datasetClassFormatter,
                customEditor : {getElement: simpleSelectEditor, customEditorParameters: {options: classTypes}},
                tdStyle      : { whiteSpace: 'normal' },
                thStyle      : { whiteSpace: 'normal' },
            },
            {
                dataField    : 'flags',
                text         : 'Flags',
                hidden       : hideMe,
                width        : '115px',
                dataFormat   : datasetFlagsFormatter,
                customEditor : {getElement: datasetFlagsEditor},
                tdStyle      : { whiteSpace: 'normal' },
                thStyle      : { whiteSpace: 'normal' },
            },
            {
                dataField    : 'structure',
                text         : 'Structure',
                hidden       : hideMe,
                customEditor : {getElement: simpleInputEditor},
                tdStyle      : { whiteSpace: 'normal' },
                thStyle      : { whiteSpace: 'normal' },
                editable     : { type: 'textarea' }
            },
            {
                dataField : 'keys',
                text      : 'Keys',
                width     : '7%',
                hidden    : hideMe,
                tdStyle   : { whiteSpace: 'normal', overflowWrap: 'break-word' },
                thStyle   : { whiteSpace: 'normal' },
                editable  : false
            },
            {
                dataField    : 'comment',
                text         : 'Comment',
                width        : '35%',
                tdStyle      : { whiteSpace: 'pre-wrap' },
                thStyle      : { whiteSpace: 'normal' },
                dataFormat   : commentFormatter,
                customEditor : { getElement: commentEditor }
            },
            {
                dataField    : 'leaf',
                text         : 'Location',
                hidden       : hideMe,
                dataFormat   : leafFormatter,
                customEditor : {getElement: leafEditor},
                tdStyle      : { whiteSpace: 'normal' },
                thStyle      : { whiteSpace: 'normal' }
            }

        ];

        return (
            <BootstrapTable
                data={datasets}
                options={options}
                search
                deleteRow
                insertRow
                striped
                hover
                version='4'
                cellEdit={cellEditProp}
                keyBoardNav={{enterToEdit: true}}
                headerStyle={{backgroundColor: indigo[500], color: grey[200], fontSize: '16px'}}
                selectRow={selectRowProp}
            >
                {renderColumns(columns)}
            </BootstrapTable>
        );
    }
}

ConnectedDatasetTable.propTypes = {
    itemGroups    : PropTypes.object.isRequired,
    itemDefs      : PropTypes.object.isRequired,
    comments      : PropTypes.object.isRequired,
    defineVersion : PropTypes.string.isRequired,
};

const DatasetTable = connect(mapStateToProps, mapDispatchToProps)(ConnectedDatasetTable);
export default DatasetTable;