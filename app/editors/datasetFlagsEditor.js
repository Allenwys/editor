import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import SaveCancel from 'editors/saveCancel.js';

const styles = theme => ({
    formControl: {
        whiteSpace   : 'normal',
        overflowWrap : 'break-word',
    },
    root: {
        outline: 'none',
    },
});

class DatasetFlagsEditor extends React.Component {
    constructor (props) {
        super(props);
        this.rootRef = React.createRef();
        this.state = {
            repeating       : this.props.defaultValue.repeating === 'Yes',
            isReferenceData : this.props.defaultValue.isReferenceData === 'Yes',
        };
    }

    componentDidMount() {
        this.rootRef.current.focus();
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
    }

    save = () => {
        let result = {
            repeating       : this.state.repeating ? 'Yes' : 'No',
            isReferenceData : this.state.isReferenceData ? 'Yes' : 'No',
        };
        this.props.onUpdate(result);
    }

    cancel = () => {
        this.props.onUpdate(this.props.defaultValue);
    }

    onKeyDown = (event)  => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            this.cancel();
        } else if (event.ctrlKey && (event.keyCode === 83)) {
            this.save();
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div
                onKeyDown={this.onKeyDown}
                tabIndex='0'
                ref={this.rootRef}
                className={classes.root}
            >
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.repeating}
                                        color='primary'
                                        onChange={this.handleChange('repeating')}
                                        value="Repeating"
                                    />
                                }
                                label="Repeating"
                                className={classes.formControl}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.isReferenceData}
                                        color='primary'
                                        onChange={this.handleChange('isReferenceData')}
                                        value="isReferenceData"
                                    />
                                }
                                label="Reference Data"
                                className={classes.formControl}
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <SaveCancel mini icon save={this.save} cancel={this.cancel}/>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

DatasetFlagsEditor.propTypes = {
    classes      : PropTypes.object.isRequired,
    defaultValue : PropTypes.object.isRequired,
    onUpdate     : PropTypes.func.isRequired,
};

export default withStyles(styles)(DatasetFlagsEditor);
