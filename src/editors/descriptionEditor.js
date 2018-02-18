import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import CommentEditor from 'editors/commentEditor.js';
import MethodEditor from 'editors/methodEditor.js';
import OriginEditor from 'editors/originEditor.js';
import SaveCancel from 'editors/saveCancel.js';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    iconButton: {
        marginBottom: '8px',
    },
    gridItem: {
        margin: 'none',
    },
});

class DescriptionEditor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            origins   : this.props.defaultValue.origins,
            comment   : this.props.defaultValue.comment,
            method    : this.props.defaultValue.method,
            mandatory : this.props.defaultValue.mandatory,
            prognote  : this.props.defaultValue.prognote,
        };
    }

    handleChange = (name, originId) => (updateObj) => {
        this.setState({[name]: updateObj});
    }

    save = () => {
        let updatedComment = this.state.comment;
        // If Origin is not derived and method is shown only for derived origins
        // and a method exists, then remove the method
        // TODO: add condition when method is shown only for derived origin
        if (this.state.origins[0].type !== 'Derived' && this.state.method !== undefined) {
            this.setState({method: undefined});
        }
        this.props.onUpdate(updatedComment);
    }

    cancel = () => {
        this.props.onUpdate(this.props.defaultValue);
    }

    render () {
        const { classes } = this.props;
        let childProps = Object.assign({}, this.props);
        let origin = this.state.origins[0].type;
        delete childProps.classes;

        return (
            <Grid container spacing={8} alignItems='center'>
                <Grid item xs={12} className={classes.gridItem}>
                    <OriginEditor {...childProps} defaultValue={this.state.origins} onUpdate={this.handleChange('origins')}/>
                </Grid>
                <Grid item xs={12} className={classes.gridItem}>
                    <Divider/>
                </Grid>
                <Grid item xs={12} className={classes.gridItem}>
                    <CommentEditor {...childProps} defaultValue={this.state.comment} onUpdate={this.handleChange('comment')} stateless={true}/>
                </Grid>
                <Grid item xs={12} className={classes.gridItem}>
                    <Divider/>
                </Grid>
                <Grid item xs={12} className={classes.gridItem}>
                    {origin === 'Derived' &&
                        <MethodEditor {...childProps} defaultValue={this.state.method} onUpdate={this.handleChange('method')} stateless={true}/>
                    }
                </Grid>
                <Grid item xs={12} className={classes.gridItem}>
                    <Divider/>
                </Grid>
                <Grid item xs={12} className={classes.gridItem}>
                    <SaveCancel save={this.save} cancel={this.cancel} />
                </Grid>
            </Grid>
        );
    }
}

DescriptionEditor.propTypes = {
    defaultValue    : PropTypes.object,
    leafs           : PropTypes.object.isRequired,
    annotatedCrf    : PropTypes.array.isRequired,
    supplementalDoc : PropTypes.array.isRequired,
    model           : PropTypes.string.isRequired,
};

export default withStyles(styles)(DescriptionEditor);
