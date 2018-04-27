import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
//import Typography from 'material-ui/Typography';
import FormatAlignLeftIcon from 'material-ui-icons/FormatAlignLeft';
import FormatAlignJustifyIcon from 'material-ui-icons/FormatAlignJustify';
import StorageIcon from 'material-ui-icons/Storage';
import Tooltip from 'material-ui/Tooltip';

const styles = theme => ({
});

class datasetFlagsFormatter extends React.Component {

    render () {
        const { value }  = this.props;

        const repeatingTooltipText = value.repeating === 'Yes' ? 'Repeating' : 'Not repeating';

        return (
            <Grid container spacing={16}>
                <Grid item>
                    <Tooltip title={repeatingTooltipText} placement='bottom'>
                        {value.repeating === 'Yes' ? <FormatAlignLeftIcon/> : <FormatAlignJustifyIcon/>}
                    </Tooltip>
                </Grid>
                {value.isReferenceData === 'Yes' &&
                        <Grid item>
                            <Tooltip title='Reference Data' placement='bottom'>
                                <StorageIcon/>
                            </Tooltip>
                        </Grid>
                }
            </Grid>
        );
    }
}

datasetFlagsFormatter.propTypes = {
    value         : PropTypes.object,
    defineVersion : PropTypes.string.isRequired,
};

export default withStyles(styles)(datasetFlagsFormatter);