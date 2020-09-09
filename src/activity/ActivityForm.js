import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%',
    }
}));

export default function ActivityForm(props) {
    const classes = useStyles();
    const [formContent, setFormContent] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        document.activeElement.blur();
        document.getElementById("new_activity_form").reset();
        document.getElementById("new_activity_input").value = "";
        props.newActivityAdded(formContent);
    }

    return (
        <React.Fragment>
            <form id="new_activity_form"
                onSubmit={handleSubmit}
                className={classes.form}>
                <TextField
                    id="new_activity_input"
                    color="secondary"
                    fullWidth
                    onChange={event => setFormContent(event.target.value)}
                    placeholder="What are you working with?"
                    inputProps={{ style: { color: props.darkMode ? 'black' : 'white' } }} />
            </form>
        </React.Fragment>
    );
}