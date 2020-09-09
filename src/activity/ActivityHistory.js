import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Box, Collapse, Typography } from '@material-ui/core';
import HistoryEntry from './HistoryEntry';

export default function ActivityHistory(props) {
    const today = new Date();

    const filterEntry = (timeEntry) => {
        return timeEntry.startTime.getFullYear() === today.getFullYear() &&
            timeEntry.startTime.getMonth() === today.getMonth() &&
            timeEntry.startTime.getDate() === today.getDate();
    }

    return (
        <React.Fragment>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={props.showHistory} timeout="auto" unmountOnExit>
                        {props.timeEntries.some(filterEntry) ?
                            <Box marginBottom={2}>
                                <Table size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Start</TableCell>
                                            <TableCell align="left">End</TableCell>
                                            <TableCell align="right">Duration</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {props.timeEntries.filter(filterEntry).map(timeEntry => (
                                            <HistoryEntry key={timeEntry.id}
                                                start={timeEntry.startTime}
                                                end={timeEntry.endTime}
                                                onDateChange={props.onHistoryEdit} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                            : <Box margin={1}><Typography color="textSecondary">No time entries today</Typography></Box>}
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}