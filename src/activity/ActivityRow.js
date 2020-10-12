import React, { useState, useEffect } from 'react';

import { TableRow, TableCell, Fade, Typography, IconButton } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';

import TimerButton from './TimerButton';
import ActivityHistory from './ActivityHistory';
import ActivityTitleWithMenu from './ActivityTitle';
import { getLoggedTime } from '../common/Util';

export default function ActivityRow(props) {
    const [showHistory, setShowHistory] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(getLoggedTime(props.activityItem.timeEntries, props.activityItem.currentTimeEntry));

    useEffect(() => {
        let interval = null;
        if (props.isActive) {
            interval = setInterval(() => {
                setElapsedTime(getLoggedTime(props.activityItem.timeEntries, props.activityItem.currentTimeEntry));
            }, 200);
        } else if (!props.isActive && elapsedTime !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    });

    const onToggleActive = _ => {
        props.onToggleActive(props.activityItem.id);
    }

    const onMenuAction = action => {
        props.onMenuAction(props.activityItem.id, action);
    };

    const onHistoryEdit = _ => {
        setElapsedTime(getLoggedTime(props.activityItem.timeEntries, props.activityItem.currentTimeEntry));
    }

    return (
        <React.Fragment>
            <Fade in={true} timeout={500}>
                <TableRow key={props.activityItem.id} id={props.activityItem.id} hover={true}>
                    <TableCell align="left">
                        <IconButton aria-label="expand row" size="small" onClick={() => setShowHistory(!showHistory)}>
                            {showHistory ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row" style={{ minWidth: "30%" }} align="left" aria-controls="simple-menu" aria-haspopup="true" >
                        <ActivityTitleWithMenu title={props.activityItem.title} onMenuAction={onMenuAction} />
                    </TableCell >
                    <TableCell align="right">
                        <Typography>{elapsedTime}</Typography>
                    </TableCell>
                    <TableCell align="right">
                        <TimerButton onToggleActive={onToggleActive} isActive={props.isActive} />
                    </TableCell>
                </TableRow>
            </Fade>
            <ActivityHistory timeEntries={props.activityItem.timeEntries} showHistory={showHistory} onHistoryEdit={onHistoryEdit} />
        </React.Fragment>
    );
}