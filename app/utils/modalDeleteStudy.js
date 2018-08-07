import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { ipcRenderer } from 'electron';
import {
    deleteStudy,
    closeModal,
} from 'actions/index.js';

const styles = theme => ({
    dialog: {
        paddingLeft   : theme.spacing.unit * 2,
        paddingRight  : theme.spacing.unit * 2,
        paddingBottom : theme.spacing.unit * 1,
        position      : 'absolute',
        borderRadius  : '10px',
        top           : '40%',
        transform     : 'translate(0%, calc(-50%+0.5px))',
        overflowX     : 'auto',
        maxHeight     : '85%',
        overflowY     : 'auto',
    },
});

const mapDispatchToProps = dispatch => {
    return {
        deleteStudy: deleteObj => dispatch(deleteStudy(deleteObj)),
        closeModal: () => dispatch(closeModal()),
    };
};

class ConnectedModalDeleteStudy extends React.Component {

    onDelete = () => {
        this.props.deleteStudy({
            studyId: this.props.studyId,
            defineIds: this.props.defineIds,
        });
        this.props.defineIds.forEach( defineId => {
            ipcRenderer.send('deleteDefineObject', defineId);
        });
        this.props.closeModal();
    }

    onCancel = () => {
        this.props.closeModal();
    }

    onKeyDown = (event)  => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            this.onCancel();
        } else if (event.ctrlKey && (event.keyCode === 83)) {
            this.onDelete();
        }
    }

    render () {
        const { classes } = this.props;

        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                open
                PaperProps={{className: classes.dialog}}
                onKeyDown={this.onKeyDown}
                tabIndex='0'
            >
                <DialogTitle id="alert-dialog-title">
                    Delete Study
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Delete the study and {this.props.defineIds.length} Define-XML documents associated with it?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onDelete} color="primary">
                        Delete
                    </Button>
                    <Button onClick={this.onCancel} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

ConnectedModalDeleteStudy.propTypes = {
    classes: PropTypes.object.isRequired,
    studyId: PropTypes.string.isRequired,
    defineIds: PropTypes.array.isRequired,
};

const ModalDeleteStudy = connect(undefined, mapDispatchToProps)(ConnectedModalDeleteStudy);
export default withStyles(styles)(ModalDeleteStudy);
