import {BootstrapTable, ButtonGroup} from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { connect } from 'react-redux';
import renderColumns from 'utils/renderColumns.js';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import React from 'react';
import green from 'material-ui/colors/green';
import indigo from 'material-ui/colors/indigo';
import grey from 'material-ui/colors/grey';
import { withStyles } from 'material-ui/styles';
import deepEqual from 'fast-deep-equal';
import RemoveRedEyeIcon from 'material-ui-icons/RemoveRedEye';
import FilterListIcon from 'material-ui-icons/FilterList';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ExpandLessIcon from 'material-ui-icons/ExpandLess';
import KeyOrderEditor from 'editors/keyOrderEditor.js';
import DescriptionEditor from 'editors/descriptionEditor.js';
//import SimpleInputEditor from 'editors/simpleInputEditor.js';
import SimpleSelectEditor from 'editors/simpleSelectEditor.js';
import RoleMandatoryEditor from 'editors/roleMandatoryEditor.js';
import VariableLengthEditor from 'editors/variableLengthEditor.js';
import DescriptionFormatter from 'formatters/descriptionFormatter.js';
import RoleMandatoryFormatter from 'formatters/roleMandatoryFormatter.js';
import VariableLengthFormatter from 'formatters/variableLengthFormatter.js';
import VariableCodeListFormatEditor from 'editors/variableCodeListFormatEditor.js';
import VariableCodeListFormatFormatter from 'formatters/variableCodeListFormatFormatter.js';
import VariableNameLabelWhereClauseEditor from 'editors/variableNameLabelWhereClauseEditor.js';
import VariableNameLabelWhereClauseFormatter from 'formatters/variableNameLabelWhereClauseFormatter.js';
import { updateItemDef } from 'actions/index.js';

// Selector constants
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

// Redux functions
const mapDispatchToProps = dispatch => {
    return {
        updateItemDef: (oid, updateObj) => dispatch(updateItemDef(oid, updateObj)),
    };
};

const mapStateToProps = state => {
    return {
        mdv: state.odm.study.metaDataVersion
    };
};

// Debug options
const hideMe = false;

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

// Editors
function descriptionEditor (onUpdate, props) {
    return (<DescriptionEditor onUpdate={ onUpdate } {...props}/>);
}

/*
function simpleInputEditor (onUpdate, props) {
    return (<SimpleInputEditor onUpdate={ onUpdate } {...props}/>);
}
*/

function simpleSelectEditor (onUpdate, props) {
    return (<SimpleSelectEditor onUpdate={ onUpdate } {...props}/>);
}

function variableNameLabelWhereClauseEditor (onUpdate, props) {
    return (<VariableNameLabelWhereClauseEditor onUpdate={ onUpdate } {...props}/>);
}

function variableLengthEditor (onUpdate, props) {
    return (<VariableLengthEditor onUpdate={ onUpdate } {...props}/>);
}

function variableCodeListFormatEditor (onUpdate, props) {
    return (<VariableCodeListFormatEditor onUpdate={ onUpdate } {...props}/>);
}

function keyOrderEditor (onUpdate, props) {
    return (<KeyOrderEditor onUpdate={ onUpdate } {...props}/>);
}

function roleMandatoryEditor (onUpdate, props) {
    return (<RoleMandatoryEditor onUpdate={ onUpdate } {...props}/>);
}

// Formatters
function descriptionFormatter (cell, row) {
    return (<DescriptionFormatter value={cell} model={row.model}/>);
}

function variableCodeListFormatFormatter (cell, row) {
    return <VariableCodeListFormatFormatter value={cell} defineVersion={row.defineVersion}/>;
}

function variableLengthFormatter (cell, row) {
    return (<VariableLengthFormatter value={cell} defineVersion={row.defineVersion} dataType={row.dataType}/>);
}

function keyOrderFormatter (cell, row) {
    return (
        <Grid container spacing={16}>
            <Grid item>
                {cell.orderNumber}
            </Grid>
            {cell.keySequence !== undefined &&
                    <Grid item>
                        <abbr title='Key Sequence'>K</abbr>: {cell.keySequence}
                    </Grid>
            }
        </Grid>
    );
}

function variableNameLabelWhereClauseFormatter (cell, row) {
    const hasVlm = (row.valueList !== undefined);
    if (hasVlm) {
        const state = this.state.vlmData[row.oid].state;
        return (
            <VariableNameLabelWhereClauseFormatter
                value={cell}
                defineVersion={row.defineVersion}
                toggleVlmRow={this.toggleVlmRow}
                itemOid={row.oid}
                hasVlm={hasVlm}
                state={state}
                mdv={row.mdv}
            />
        );
    } else {
        return (
            <VariableNameLabelWhereClauseFormatter
                value={cell}
                defineVersion={row.defineVersion}
                mdv={row.mdv}
            />
        );

    }
}

function roleMandatoryFormatter (cell, row) {
    return (<RoleMandatoryFormatter value={cell} model={row.model}/>);
}

// Extract data required for the table;
function getTableData ({source, datasetName, itemDefs, mdv, defineVersion, vlmLevel}={}) {
    let result = [];
    Object.keys(source.itemRefs).forEach((itemRefOid, index) => {
        const originVar = source.itemRefs[itemRefOid];
        const originItemDef = itemDefs[originVar.itemOid];
        let currentVar = {
            groupOid      : source.oid,
            itemRefOid    : originVar.oid,
            oid           : originItemDef.oid,
            name          : originItemDef.name,
            dataType      : originItemDef.dataType,
            codeList      : originItemDef.codeList,
            valueList     : originItemDef.valueList,
            model         : mdv.model,
            mdv           : mdv,
            defineVersion : defineVersion,
            vlmLevel      : vlmLevel,
        };
        currentVar.lengthAttrs = {
            length           : originItemDef.length,
            fractionDigits   : originItemDef.fractionDigits,
            lengthAsData     : originItemDef.lengthAsData,
            lengthAsCodelist : originItemDef.lengthAsCodelist,
        };
        currentVar.codeListFormatAttrs = {
            codeList      : originItemDef.codeList,
            displayFormat : originItemDef.displayFormat,
            dataType      : originItemDef.dataType,
        };
        currentVar.description = {
            comment : mdv.comments[originItemDef.commentOid],
            method  : originVar.method,
            origins : originItemDef.origins,
            note    : originItemDef.note,
            varName : originItemDef.name,
            model   : mdv.model,
        };
        currentVar.nameLabelWhereClause = {
            name         : originItemDef.name,
            descriptions : originItemDef.descriptions,
            whereClause  : originVar.whereClause,
        };
        if (originVar.whereClause !== undefined) {
            // VLM itemRef
            currentVar.fullName = datasetName + '.' + originItemDef.name + ' [' + originVar.whereClause.toString(mdv) + ']';
        } else {
            // Normal itemRef
            currentVar.fullName = datasetName + '.' + originItemDef.name;
        }

        currentVar.keyOrder = {
            orderNumber : (source.itemRefsOrder.indexOf(itemRefOid) + 1),
            keySequence : originVar.keySequence,
            itemGroup   : source,
        };
        currentVar.roleMandatory = {
            mandatory    : originVar.mandatory,
            role         : originVar.role,
            roleCodeList : originVar.roleCodeList,
        };
        result[currentVar.keyOrder.orderNumber-1] = currentVar;
    });
    return result;
}

class ConnectedVariableTable extends React.Component {
    constructor(props) {
        super(props);
        const mdv = this.props.mdv;
        //const model = mdv.model;
        const dataset = mdv.itemGroups[this.props.itemGroupOid];
        // Get variable level metadata
        let variables = getTableData({
            source        : dataset,
            datasetName   : dataset.name,
            itemDefs      : mdv.itemDefs,
            mdv           : this.props.mdv,
            defineVersion : this.props.defineVersion,
            vlmLevel      : 0,
        });
        // Get VLM metadata and set toggle status for each
        let vlmData = {};
        variables.filter( item => item.valueList !== undefined ).forEach( item => {
            vlmData[item.oid] = {};
            vlmData[item.oid].state = 'collaps';
            vlmData[item.oid].data = getTableData({
                source        : item.valueList,
                datasetName   : dataset.name,
                itemDefs      : mdv.itemDefs,
                mdv           : mdv,
                defineVersion : this.props.defineVersion,
                vlmLevel      : 1,
            });
        });

        this.state = {
            variables : variables,
            vlmData   : vlmData,
            vlmState  : 'collaps',
            dataset   : dataset,
        };
    }

    onBeforeSaveCell = (row, cellName, cellValue) => {
        // Update on if the value changed
        if (!deepEqual(row[cellName], cellValue)) {
            if (cellName === 'Description') {
                // TODO
            } else {
                if (row.vlmLevel === 0) {
                    this.props.updateItemDef(row.oid, cellValue);
                    let updateObj = {};
                    updateObj[cellName] = cellValue;
                }
            }
        }
        return true;
    }

    toggleVlmAndVariablesData = (itemOid, variables, vlmData) => {
        // This function is not pure
        // Toggle the vlm state
        let startIndex = variables.map(item => item.oid).indexOf(itemOid) + 1;
        if (vlmData[itemOid].state === 'collaps') {
            // Insert VLM rows
            variables.splice.apply(variables, [startIndex, 0].concat(vlmData[itemOid].data));
            vlmData[itemOid].state = 'expand';
        } else {
            // Remove VLM rows
            variables.splice(startIndex, vlmData[itemOid].data.length);
            vlmData[itemOid].state = 'collaps';
        }
    }

    toggleVlmRow = (itemOid) => () => {
        // Shallow copy the state
        let variables = this.state.variables.slice();
        let vlmData = {};
        Object.keys(this.state.vlmData).forEach( vlmItemOid => {
            vlmData[vlmItemOid] = Object.assign({}, this.state.vlmData[vlmItemOid]);
        });
        // Update the state
        this.toggleVlmAndVariablesData(itemOid, variables, vlmData);
        // Final result
        let result = {
            variables : variables,
            vlmData   : vlmData,
        };
        // Check if all of the states became collapsed/expanded;
        if (Object.keys(vlmData).filter( vlm => vlmData[vlm].state === 'collaps').length === 0) {
            result.vlmState = 'expand';
        } else if (Object.keys(vlmData).filter( vlm => vlmData[vlm].state === 'expand').length === 0) {
            result.vlmState = 'collaps';
        }
        this.setState(result);
    }

    toggleVlmRows = (type) => () => {
        if (Object.keys(this.state.vlmData).length === 0) {
            // If dataset has no VLM, exit;
            return;
        } else if (type === this.state.vlmState) {
            // If all are already collapsed or expanded
            return;
        }
        // Shallow copy the state
        let variables = this.state.variables.slice();
        let vlmData = {};
        Object.keys(this.state.vlmData).forEach( vlmItemOid => {
            vlmData[vlmItemOid] = Object.assign({}, this.state.vlmData[vlmItemOid]);
        });
        // Update the state
        Object.keys(this.state.vlmData).forEach( vlmItemOid => {
            if (this.state.vlmData[vlmItemOid].state !== type) {
                this.toggleVlmAndVariablesData(vlmItemOid, variables, vlmData);
            }
        });
        // Final result
        let result = {
            variables : variables,
            vlmData   : vlmData,
            vlmState  : type,
        };
        this.setState(result);
    }

    createCustomButtonGroup = props => {
        return (
            <ButtonGroup className='my-custom-class' sizeClass='btn-group-md'>
                <Grid container spacing={16}>
                    <Grid item>
                        { props.showSelectedOnlyBtn }
                    </Grid>
                    <Grid item>
                        { props.insertBtn }
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
                    <Grid container spacing={16} justify='flex-end'>
                        { Object.keys(this.state.vlmData).length > 0 &&
                                <Grid item>
                                    <Button
                                        variant="raised"
                                        color="default"
                                        onClick={this.toggleVlmRows(this.state.vlmState === 'collaps' ? 'expand' : 'collaps')}
                                    >
                                        {this.state.vlmState === 'collaps' ? 'Expand' : 'Collaps'} VLM
                                        {this.state.vlmState === 'collaps' ? <ExpandMoreIcon style={{marginLeft: '7px'}}/> : <ExpandLessIcon style={{marginLeft: '7px'}}/>}
                                    </Button>
                                </Grid>
                        }
                        <Grid item>
                            <Button variant="raised" color="default">
                                Filter
                                <FilterListIcon style={{marginLeft: '7px'}}/>
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="raised" color="default">
                                Columns
                                <RemoveRedEyeIcon style={{marginLeft: '7px'}}/>
                            </Button>
                        </Grid>
                        <Grid item>
                            { props.components.searchPanel }
                        </Grid>
                    </Grid>
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

    highLightVlmRows = (row, rowIndex) => {
        return (row.vlmLevel > 0 ? 'vlmRow' : 'variableRow');
    }

    render () {
        // Extract data required for the variable table
        const mdv = this.props.mdv;
        const model = mdv.model;

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
            insertBtn : this.createCustomInsertButton,
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
                dataField    : 'keyOrder',
                text         : 'Key, Position',
                hidden       : hideMe,
                width        : '110px',
                dataFormat   : keyOrderFormatter,
                customEditor : {getElement: keyOrderEditor},
                tdStyle      : { whiteSpace: 'normal' },
                thStyle      : { whiteSpace: 'normal' }
            },
            {
                dataField    : 'nameLabelWhereClause',
                text         : 'Name, Label, Where Clause',
                width        : '300px',
                hidden       : hideMe,
                dataFormat   : variableNameLabelWhereClauseFormatter.bind(this),
                customEditor : {getElement: variableNameLabelWhereClauseEditor, customEditorParameters: {blueprint: mdv, dataset: this.state.dataset, mdv: mdv}},
                tdStyle      : { whiteSpace: 'normal' },
                thStyle      : { whiteSpace: 'normal' }
            },
            {
                dataField    : 'dataType',
                text         : 'Type',
                width        : '100px',
                hidden       : hideMe,
                customEditor : {getElement: simpleSelectEditor, customEditorParameters: {options: dataTypes, optional: true}},
                tdStyle      : { whiteSpace: 'normal' },
                thStyle      : { whiteSpace: 'normal' }
            },
            {
                dataField    : 'lengthAttrs',
                text         : 'Length',
                hidden       : hideMe,
                width        : '110px',
                dataFormat   : variableLengthFormatter,
                customEditor : {getElement: variableLengthEditor},
                tdStyle      : { whiteSpace: 'normal' },
                thStyle      : { whiteSpace: 'normal' }
            },
            {
                dataField    : 'roleMandatory',
                text         : model === 'ADaM' ? 'Mandatory' : 'Role, Mandatory',
                hidden       : hideMe,
                width        : '110px',
                dataFormat   : roleMandatoryFormatter,
                customEditor : {getElement: roleMandatoryEditor, customEditorParameters: {model: model}},
                tdStyle      : { whiteSpace: 'normal' },
                thStyle      : { whiteSpace: 'normal' }
            },
            {
                dataField    : 'codeListFormatAttrs',
                text         : 'Codelist, Display Format',
                hidden       : hideMe,
                width        : '130px',
                dataFormat   : variableCodeListFormatFormatter,
                customEditor : {getElement: variableCodeListFormatEditor, customEditorParameters: {codeLists: mdv.codeLists}},
                tdStyle      : { whiteSpace: 'normal' },
                thStyle      : { whiteSpace: 'normal' }
            },
            {
                dataField    : 'description',
                text         : 'Description',
                hidden       : false,
                width        : '40%',
                dataFormat   : descriptionFormatter,
                tdStyle      : { whiteSpace: 'normal' },
                thStyle      : { whiteSpace: 'normal' },
                customEditor : {
                    getElement             : descriptionEditor,
                    customEditorParameters : {
                        leafs           : mdv.leafs,
                        supplementalDoc : mdv.supplementalDoc,
                        annotatedCrf    : mdv.annotatedCrf,
                        model           : mdv.model,
                        defineVersion   : '2.0',
                    }
                },
            },
        ];

        return (
            <React.Fragment>
                <h3 style={{marginTop: '20px', marginBottom: '10px', color: grey[600]}}>
                    {mdv.itemGroups[this.props.itemGroupOid].name + ' (' + mdv.itemGroups[this.props.itemGroupOid].getDescription() + ')'}
                </h3>
                <BootstrapTable
                    data={this.state.variables}
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
                    trClassName={this.highLightVlmRows}
                >
                    {renderColumns(columns)}
                </BootstrapTable>
            </React.Fragment>
        );
    }
}

ConnectedVariableTable.propTypes = {
    mdv           : PropTypes.object.isRequired,
    itemGroupOid  : PropTypes.string.isRequired,
    defineVersion : PropTypes.string.isRequired,
};

const VariableTable = connect(mapStateToProps, mapDispatchToProps)(ConnectedVariableTable);
export default withStyles(styles)(VariableTable);
