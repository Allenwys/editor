import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import EditingControlIcons from 'editors/editingControlIcons.js';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Switch from '@material-ui/core/Switch';
import { Standard } from 'elements.js';
import getSelectionList from 'utils/getSelectionList.js';
import getModelFromStandard from 'utils/getModelFromStandard.js';

const styles = theme => ({
    Standard: {
        padding   : 16,
        marginTop : theme.spacing.unit * 1,
        outline   : 'none',
    },
    inputField: {
        minWidth: '200',
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    listItem: {
        marginRight: theme.spacing.unit,
    },
    switch: {
        marginLeft: theme.spacing.unit * 3,
    },
});

class StandardEditor extends React.Component {

    constructor (props) {

        super(props);

        // Clone standards
        let standardsCopy = {};
        Object.keys(this.props.standards).forEach( standardOid => {
            standardsCopy[standardOid] = new Standard(this.props.standards[standardOid]);
        });
        this.state = { standards: standardsCopy, hasArm: this.props.hasArm };
    }

    handleChange = (name, oid) => (event) => {
        if (name === 'name' || name === 'version') {
            let newStandards = this.state.standards;
            newStandards[oid] = new Standard({ ...this.state.standards[oid], [name]: event.target.value });
            if (name === 'name' && getModelFromStandard(event.target.value) !== 'ADaM' && this.state.hasArm === true) {
                this.setState({ standards: newStandards, hasArm: false });
            } else {
                this.setState({ standards: newStandards });
            }
        } else if (name === 'hasArm') {
            this.setState({ hasArm: !this.state.hasArm });
        }
    }

    getStandards = (isAdam) => {
        let standards = this.state.standards;
        let nameList = this.props.stdConstants.standardNames[this.props.defineVersion];
        let stdList = Object.keys(standards)
            .filter(standardOid => {
                return !(standards[standardOid].name === 'CDISC/NCI' && standards[standardOid].type === 'CT');
            })
            .map(standardOid => {
                return (
                    <TableRow key={standardOid}>
                        { this.props.defineVersion === '2.1.0' &&
                            <TableCell>
                                <Tooltip title="Remove Standard" placement="bottom-end">
                                    <IconButton
                                        color='secondary'
                                        onClick={this.handleChange('deleteCt',standardOid)}
                                        className={this.props.classes.button}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        }
                        <TableCell>
                            <TextField
                                value={standards[standardOid].name}
                                select
                                onChange={this.handleChange('name',standardOid)}
                                className={this.props.classes.inputField}
                            >
                                {getSelectionList(nameList)}
                            </TextField>
                        </TableCell>
                        <TableCell>
                            <TextField
                                value={standards[standardOid].version}
                                onChange={this.handleChange('version',standardOid)}
                                className={this.props.classes.inputField}
                            />
                        </TableCell>
                        { isAdam &&
                                <TableCell>
                                    <Switch
                                        checked={this.state.hasArm}
                                        onChange={this.handleChange('hasArm')}
                                        color='primary'
                                        className={this.props.classes.switch}
                                    />
                                </TableCell>
                        }
                    </TableRow>
                );
            });
        return stdList;
    };

    save = () => {
        this.props.onSave(this.state);
    }

    onKeyDown = (event)  => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            this.props.onCancel();
        } else if (event.ctrlKey && (event.keyCode === 83)) {
            this.save();
        }
    }

    render () {
        const { classes } = this.props;
        const isAdam = (getModelFromStandard(Object.values(this.state.standards)[0].name) === 'ADaM');
        return (
            <Paper className={classes.Standard} elevation={4} onKeyDown={this.onKeyDown} tabIndex='0'>
                <Typography variant="headline" component="h3">
                    Standard
                    <EditingControlIcons onSave={this.save} onCancel={this.props.onCancel} />
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            { this.props.defineVersion === '2.1.0' &&
                                    <TableCell></TableCell>
                            }
                            <TableCell>Name</TableCell>
                            <TableCell>Version</TableCell>
                            { isAdam &&
                                    <TableCell>Analysis Result Metadata</TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.getStandards(isAdam)}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

StandardEditor.propTypes = {
    standards    : PropTypes.object.isRequired,
    stdConstants : PropTypes.object.isRequired,
    classes      : PropTypes.object.isRequired,
    hasArm       : PropTypes.bool.isRequired,
    onSave       : PropTypes.func.isRequired,
    onCancel     : PropTypes.func.isRequired,
    onHelp       : PropTypes.func,
    onComment    : PropTypes.func,
};

export default withStyles(styles)(StandardEditor);
