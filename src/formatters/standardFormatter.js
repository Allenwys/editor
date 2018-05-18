import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import FormattingControlIcons from 'formatters/formattingControlIcons.js';

const styles = theme => ({
    mainPart: {
        padding   : 16,
        marginTop : theme.spacing.unit * 1,
    },
});

class StandardFormatter extends React.Component {

    getStandards = () => {
        let standards = this.props.standards;
        let ctList = Object.keys(standards)
            .filter(standardOid => {
                return !(standards[standardOid].name === 'CDISC/NCI' && standards[standardOid].type === 'CT');
            })
            .map(standardOid => {
                return (
                    <TableRow key={standardOid}>
                        <TableCell>
                            {standards[standardOid].name}
                        </TableCell>
                        <TableCell>
                            {standards[standardOid].version}
                        </TableCell>
                    </TableRow>
                );
            });
        return ctList;
    };

    render () {
        const { classes } = this.props;

        return (
            <Paper className={classes.mainPart} elevation={4}>
                <Typography variant="headline" component="h3">
                    Standard
                    <FormattingControlIcons onEdit={this.props.onEdit} onComment={this.props.onComment} />
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Version</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.getStandards()}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

StandardFormatter.propTypes = {
    standards : PropTypes.object.isRequired,
    classes   : PropTypes.object.isRequired,
    onEdit    : PropTypes.func.isRequired,
    onComment : PropTypes.func,
};

export default withStyles(styles)(StandardFormatter);
