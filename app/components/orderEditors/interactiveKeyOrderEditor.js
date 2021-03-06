/***********************************************************************************
* This file is part of Visual Define-XML Editor. A program which allows to review  *
* and edit XML files created using the CDISC Define-XML standard.                  *
* Copyright (C) 2018 Dmitry Kolosov                                                *
*                                                                                  *
* Visual Define-XML Editor is free software: you can redistribute it and/or modify *
* it under the terms of version 3 of the GNU Affero General Public License         *
*                                                                                  *
* Visual Define-XML Editor is distributed in the hope that it will be useful,      *
* but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY   *
* or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License   *
* version 3 (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.           *
***********************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { updateKeyOrder } from 'actions/index.js';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import deepEqual from 'fast-deep-equal';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import ManageKeysEditor from 'editors/manageKeysEditor.js';
import SaveCancel from 'editors/saveCancel.js';

// Redux functions
const mapDispatchToProps = dispatch => {
    return {
        updateKeyOrder: (itemGroupOid, keyOrder) => dispatch(updateKeyOrder(itemGroupOid, keyOrder)),
    };
};

const mapStateToProps = state => {
    return {
        itemGroups: state.present.odm.study.metaDataVersion.itemGroups,
        itemDefs: state.present.odm.study.metaDataVersion.itemDefs,
    };
};

const styles = theme => ({
    dialog: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        position: 'absolute',
        borderRadius: '10px',
        border: '2px solid',
        borderColor: 'primary',
        top: '20%',
        transform: 'translate(0%, calc(-20%+0.5px))',
        overflowX: 'auto',
        maxHeight: '90%',
        overflowY: 'auto',
        width: '300px',
    },
    editButton: {
        transform: 'translate(0%, -6%)',
    },
    list: {
        backgroundColor: '#F9F9F9',
        padding: '0px',
    },
    listItem: {
        borderWidth: '1px',
        backgroundColor: '#FFFFFF',
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.12)',
    },
    sortableHelper: {
        zIndex: 3000,
    },
});

const SortableItem = SortableElement(({
    value,
    className,
}) =>
    <ListItem className={className}>
        <ListItemText>{value}</ListItemText>
    </ListItem>
);

const SortableList = SortableContainer(({
    items,
    className,
    itemClass,
}) => {
    return (
        <List className={className}>
            {items.map((value, index) => (
                <SortableItem key={value.oid} index={index} value={value.name} className={itemClass} />
            ))}
        </List>
    );
});

class InteractiveKeyOrderEditorConnected extends React.Component {
    constructor (props) {
        super(props);
        let keyVariables = [];
        let allVariables = [];

        let dataset = this.props.itemGroups[this.props.row.oid];

        dataset.keyOrder.forEach(itemRefOid => {
            keyVariables.push({ oid: itemRefOid, name: this.props.itemDefs[dataset.itemRefs[itemRefOid].itemOid].name });
        });

        dataset.itemRefOrder.forEach(itemRefOid => {
            allVariables.push({ oid: itemRefOid, name: this.props.itemDefs[dataset.itemRefs[itemRefOid].itemOid].name });
        });

        this.state = {
            dialogOpened: true,
            keyVariables,
            allVariables,
        };
    }

    handleCancelAndClose = () => {
        this.setState({ dialogOpened: false });
        this.props.onFinished();
    }

    handleKeyChange = (keyVariables) => {
        this.setState({ keyVariables });
    }

    handleSaveAndClose = (updateObj) => {
        // Check if the order changed
        let originalKeyOrder = this.props.itemGroups[this.props.row.oid].keyOrder;
        let newKeyOrder = this.state.keyVariables.map(item => (item.oid));

        if (!deepEqual(originalKeyOrder, newKeyOrder)) {
            this.props.updateKeyOrder(this.props.row.oid, newKeyOrder);
        }
        this.setState({ dialogOpened: false });
        this.props.onFinished();
    }

    handleChange = ({ oldIndex, newIndex }) => {
        this.setState({
            keyVariables: arrayMove(this.state.keyVariables, oldIndex, newIndex),
        });
    };

    onKeyDown = (event) => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            this.handleCancelAndClose();
        } else if (event.ctrlKey && (event.keyCode === 83)) {
            this.handleSaveAndClose();
        }
    }

    render () {
        const { classes } = this.props;

        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={this.state.dialogOpened}
                PaperProps={{ className: classes.dialog }}
                onKeyDown={this.onKeyDown}
                tabIndex='0'
            >
                <DialogTitle>Key Order</DialogTitle>
                <DialogContent>
                    <ManageKeysEditor
                        keyVariables={this.state.keyVariables}
                        allVariables={this.state.allVariables}
                        handleChange={this.handleKeyChange}
                    />
                    <Grid container spacing={1} alignItems='flex-end'>
                        <Grid item xs={12}>
                            <SortableList
                                items={this.state.keyVariables}
                                onSortEnd={this.handleChange}
                                className={classes.list}
                                itemClass={classes.listItem}
                                helperClass={classes.sortableHelper}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SaveCancel save={this.handleSaveAndClose} cancel={this.handleCancelAndClose} justify='space-around'/>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        );
    }
}

InteractiveKeyOrderEditorConnected.propTypes = {
    row: PropTypes.object.isRequired,
    itemGroups: PropTypes.object.isRequired,
    onFinished: PropTypes.func.isRequired,
};

const InteractiveKeyOrderEditor = connect(mapStateToProps, mapDispatchToProps)(InteractiveKeyOrderEditorConnected);
export default withStyles(styles)(InteractiveKeyOrderEditor);
