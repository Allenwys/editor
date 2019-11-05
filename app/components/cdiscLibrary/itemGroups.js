/***********************************************************************************
 * This file is part of Visual Define-XML Editor. A program which allows to review  *
 * and edit XML files created using the CDISC Define-XML standard.                  *
 * Copyright (C) 2019 Dmitry Kolosov                                                *
 *                                                                                  *
 * Visual Define-XML Editor is free software: you can redistribute it and/or modify *
 * it under the terms of version 3 of the GNU Affero General Public License         *
 *                                                                                  *
 * Visual Define-XML Editor is distributed in the hope that it will be useful,      *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY   *
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License   *
 * version 3 (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.           *
 ***********************************************************************************/

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CdiscLibraryBreadcrumbs from 'components/cdiscLibrary/breadcrumbs.js';
import Loading from 'components/utils/loading.js';
import {
    changeCdiscLibraryView,
} from 'actions/index.js';

const styles = theme => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    longItemGroupButton: {
        height: 40,
    },
    shortItemGroupButton: {
        height: 40,
        width: 64,
    },
    classButton: {
        height: 40,
        width: 260,
        fontWeight: 'bold',
    },
    listItem: {
    },
    parentGroup: {
        fontWeight: 'bold',
    },
    childGroup: {
        marginLeft: theme.spacing.unit * 3,
    },
    main: {
        marginTop: theme.spacing.unit * 8,
        marginLeft: theme.spacing.unit * 1,
        marginRight: theme.spacing.unit * 1,
        outline: 'none'
    },
});

// Redux functions
const mapDispatchToProps = dispatch => {
    return {
        changeCdiscLibraryView: (updateObj) => dispatch(changeCdiscLibraryView(updateObj)),
    };
};

const mapStateToProps = state => {
    return {
        productId: state.present.ui.cdiscLibrary.itemGroups.productId,
        productName: state.present.ui.cdiscLibrary.itemGroups.productName,
        gridView: state.present.ui.cdiscLibrary.itemGroups.gridView,
    };
};

class ConnectedItemGroups extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            itemGroups: [],
            product: null,
            type: null,
            searchString: '',
        };
    }

    componentDidMount () {
        this.getItemGroups();
    }

    getItemGroups = async () => {
        let cl = this.props.cdiscLibrary;
        let product = await cl.getFullProduct(this.props.productId);
        // As a temporary bugfix, send a dummy request in 3 seconds if the object did not load
        setTimeout(() => {
            if (this.state.product === null) {
                this.dummyRequest();
            }
        }, 3000);

        this.updateState(product);
    }

    updateState = async (product) => {
        if (typeof product.dataClasses === 'object' && Object.keys(product.dataClasses).length > 0) {
            let itemGroups = [];
            Object.values(product.dataClasses)
                .sort((dc1, dc2) => (dc1.ordinal > dc2.ordinal ? 1 : -1))
                .forEach(dataClass => {
                    if (Object.keys(dataClass.getItems({ immediate: true })).length === 0) {
                        itemGroups.push({ name: dataClass.name, label: dataClass.label, type: 'headerGroup' });
                    } else {
                        itemGroups.push({ name: dataClass.name, label: dataClass.label, type: 'parentGroup' });
                    }
                    let classGroups = dataClass.getItemGroups();
                    let childGroups = Object.values(classGroups)
                        .sort((ig1, ig2) => (ig1.name > ig2.name ? 1 : -1))
                        .map(group => ({ name: group.name, label: group.label, type: 'childGroup' }));
                    if (childGroups.length > 0) {
                        itemGroups = itemGroups.concat(childGroups);
                    }
                });
            this.setState({ itemGroups, product, type: 'subgroups' });
        } else {
            let itemGroupsRaw = await product.getItemGroups({ type: 'short' });
            let itemGroups = Object.values(itemGroupsRaw).sort((ig1, ig2) => (ig1.name > ig2.name ? 1 : -1));
            this.setState({ itemGroups, product });
        }
    }

    dummyRequest = async () => {
        // There is a glitch, which causes the response not to come back in some cases
        // It is currently fixed by sending a dummy request in 1 seconds if the main response did not come back
        try {
            await this.props.cdiscLibrary.coreObject.apiRequest('/dummyEndpoint', { noCache: true });
        } catch (error) {
            // It is expected to fail, so do nothing
        }
    }

    selectItemGroup = (itemGroup) => () => {
        if (this.state.type === 'subgroups') {
            // Get type
            let type;
            let itemGroupId;
            // A simple domain/dataset is an itemGroup
            if (itemGroup.type === 'childGroup') {
                type = 'itemGroup';
                itemGroupId = itemGroup.name;
            } else {
                Object.values(this.state.product.dataClasses).forEach(dataClass => {
                    if (dataClass.name === itemGroup.name) {
                        type = 'dataClass';
                        itemGroupId = dataClass.id;
                    }
                });
            }

            this.props.changeCdiscLibraryView({ view: 'items', itemGroupId, type });
        } else {
            this.props.changeCdiscLibraryView({ view: 'items', itemGroupId: itemGroup.name, type: 'itemGroup' });
        }
    }

    handleSearchUpdate = (event) => {
        this.setState({ searchString: event.target.value });
    }

    getListClassName = (itemGroup, classes) => {
        if (itemGroup.type === 'parentGroup') {
            return classes.parentGroup;
        } else if (itemGroup.type === 'headerGroup') {
            return classes.parentGroup;
        } else if (itemGroup.type === 'childGroup') {
            return classes.childGroup;
        }
    }

    getGridClassName = (dataClass, classes) => {
        if (['Relationship', 'Associated Persons'].includes(dataClass.name)) {
            return classes.longItemGroupButton;
        } else {
            return classes.shortItemGroupButton;
        }
    }

    showGrid = () => {
        const searchString = this.state.searchString;

        // Convert the data to hierarhical structure
        let gridData = [];
        let currentGridItem = {};
        this.state.itemGroups.forEach(itemGroup => {
            if (itemGroup.type !== 'childGroup') {
                if (Object.keys(currentGridItem).length >= 1) {
                    gridData.push(currentGridItem);
                }
                currentGridItem = { ...itemGroup, childGroups: [] };
            } else {
                currentGridItem.childGroups.push(itemGroup);
            }
        });
        if (Object.keys(currentGridItem).length >= 1) {
            gridData.push(currentGridItem);
        }

        if (searchString !== '') {
            gridData = gridData.filter(dataClass => {
                dataClass.childGroups = dataClass.childGroups.filter(itemGroup => {
                    if (/[A-Z]/.test(searchString)) {
                        return itemGroup.name.includes(searchString);
                    } else {
                        return itemGroup.name.toLowerCase().includes(searchString);
                    }
                });
                if (/[A-Z]/.test(searchString)) {
                    return (dataClass.name.includes(searchString) || dataClass.childGroups.length > 0);
                } else {
                    return (dataClass.name.toLowerCase().includes(searchString) || dataClass.childGroups.length > 0);
                }
            });
        }

        return gridData.map(dataClass => (
            <Grid container justify='flex-start' direction='row' alignItems='flex-start' key={dataClass.name}>
                <Grid item>
                    <Button
                        color='primary'
                        size='large'
                        key={dataClass.name}
                        className={this.props.classes.classButton}
                        disabled={dataClass.type === 'headerGroup'}
                        onClick={this.selectItemGroup(dataClass)}
                    >
                        {dataClass.name}
                    </Button>
                    { dataClass.childGroups.map(itemGroup => (
                        <Button
                            color='primary'
                            size='large'
                            key={itemGroup.name}
                            className={this.getGridClassName(dataClass, this.props.classes)}
                            onClick={this.selectItemGroup(itemGroup)}
                        >
                            {itemGroup.name}
                        </Button>
                    ))}
                </Grid>
            </Grid>
        ));
    }

    showList = () => {
        let data = this.state.itemGroups.slice();
        const searchString = this.state.searchString;

        if (searchString !== '') {
            data = data.filter(row => {
                if (/[A-Z]/.test(searchString)) {
                    return row.name.includes(searchString) || row.label.includes(searchString);
                } else {
                    return row.name.toLowerCase().includes(searchString) || row.label.toLowerCase().includes(searchString);
                }
            });
        }

        const classes = this.props.classes;

        return (
            <List>
                {data.map(itemGroup => (
                    <ListItem
                        button
                        key={itemGroup.name}
                        className={classes.listItem}
                        disabled={itemGroup.type === 'headerGroup'}
                        onClick={this.selectItemGroup(itemGroup)}
                    >
                        <ListItemText
                            primary={itemGroup.name}
                            secondary={itemGroup.label}
                            className={this.getListClassName(itemGroup, classes)}
                        />
                    </ListItem>
                ))}
            </List>
        );
    }

    render () {
        const { classes } = this.props;

        return (
            <Grid container justify='space-between' className={classes.main}>
                <Grid item xs={12}>
                    <CdiscLibraryBreadcrumbs
                        traffic={this.props.cdiscLibrary.getTrafficStats()}
                        searchString={this.state.searchString}
                        onSearchUpdate={this.handleSearchUpdate}
                    />
                </Grid>
                <Grid item xs={12}>
                    { this.state.product === null && <Loading onRetry={this.getItemGroups} /> }
                    { this.props.gridView ? this.showGrid() : this.showList()}
                </Grid>
            </Grid>
        );
    }
}

ConnectedItemGroups.propTypes = {
    cdiscLibrary: PropTypes.object.isRequired,
    productId: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    changeCdiscLibraryView: PropTypes.func.isRequired,
};
ConnectedItemGroups.displayName = 'ItemGroups';

const ItemGroups = connect(mapStateToProps, mapDispatchToProps)(ConnectedItemGroups);
export default withStyles(styles)(ItemGroups);
