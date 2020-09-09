import React, { useState } from 'react';
import { TableRow, TableCell, Typography, TextField } from '@material-ui/core';
import { msToTimeString } from '../common/Util';

export default function HistoryEntry(props) {
    const [start, setStart] = useState(props.start);
    const [end, setEnd] = useState(props.end);

    const changeTime = (time, isStart) => {
        let newTime = (time.target.value.split(":"));
        let targetTime = isStart ? start : end;
        targetTime.setHours(newTime[0]);
        targetTime.setMinutes(newTime[1]);
        targetTime.setSeconds(newTime[2] === undefined ? 0 : newTime[2]);

        isStart ? setStart(targetTime) : setEnd(targetTime);
        props.onDateChange();
    };

    const formatTime = time => {
        if (time instanceof Date) {
            return time.toLocaleTimeString()
        } else {
            return msToTimeString(time);
        }
    };

    return (
        <React.Fragment>
            <TableRow>
                <TableCell align="left">
                    <TextField id="start_time"
                        label="" color="secondary"
                        type="time"
                        inputProps={{ step: 1 }}
                        onChange={(e) => changeTime(e, true)}
                        defaultValue={formatTime(start)} />
                </TableCell>
                <TableCell align="left">
                    <TextField id="end_time"
                        label="" color="secondary"
                        type="time"
                        inputProps={{ step: 1 }}
                        onChange={(e) => changeTime(e, false)}
                        defaultValue={formatTime(end)} />
                </TableCell>
                <TableCell align="right">
                    <Typography id="duration" >
                        {formatTime(end - start)}
                    </Typography>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}