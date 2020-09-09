import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import { PlayArrow, Pause } from '@material-ui/icons';

export default function TimerButton(props) {
    return (
        <React.Fragment>
            <IconButton size="small" edge="end" aria-label="delete" onClick={props.onToggleActive}>
                {props.isActive ? <Pause /> : <PlayArrow />}
            </IconButton>
        </React.Fragment>
    );
}