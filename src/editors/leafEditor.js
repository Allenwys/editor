import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import {Leaf} from 'elements.js';
import SaveCancel from 'editors/saveCancel.js';

const styles = theme => ({
    textField: {
        margin: 'none',
    },
});

class LeafEditor extends React.Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {leaf: props.defaultValue};
    }

    handleChange = name => event => {
        let args = {id: this.state.leaf.id, title: this.state.leaf.title, href: this.state.leaf.href};
        // Overwrite args with the updated value
        args[name] = event.target.value;
        let newLeaf = new Leaf(args);
        this.setState({leaf: newLeaf});
    };

    onKeyDown = (event)  => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            this.cancel();
        } else if (event.ctrlKey && (event.keyCode === 83)) {
            this.save();
        }
    }

    save = () => {
        this.props.onUpdate(this.state.leaf);
    }

    cancel = () => {
        this.props.onUpdate(this.props.defaultValue);
    }

    render () {
        const { classes } = this.props;

        return (
            <Grid container spacing={16} onKeyDown={this.onKeyDown} tabIndex='0'>
                <Grid item>
                    <TextField
                        label='Title'
                        fullWidth
                        autoFocus
                        multiline
                        value={this.state.leaf.title}
                        onChange={this.handleChange('title')}
                        className={classes.textField}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label='Href'
                        fullWidth
                        multiline
                        value={this.state.leaf.href}
                        onChange={this.handleChange('href')}
                        className={classes.textField}
                    />
                </Grid>
                <Grid item xs={12}>
                    <SaveCancel mini icon save={this.save} cancel={this.cancel}/>
                </Grid>
            </Grid>
        );
    }
}

LeafEditor.propTypes = {
    classes      : PropTypes.object.isRequired,
    defaultValue : PropTypes.instanceOf(Leaf).isRequired,
    onUpdate     : PropTypes.func.isRequired,
};

export default withStyles(styles)(LeafEditor);
