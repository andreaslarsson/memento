import React, { useEffect } from 'react';
import { Paper, Table, TableBody } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ActivityRow from './ActivityRow';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 400,
    },
    paper: {
        padding: theme.spacing(0),
        margin: theme.spacing(0),
        textAlign: 'left',
        color: theme.palette.text.primary,
    },
}));

export default function ActivityList(props) {
    const classes = useStyles();
    const setTitle = props.setTitle;

    useEffect(() => {
        setTitle("ActivityList");
      }, [setTitle]);

    const filterActivities = activity => {
        return activity.show;
    };

    return (
        <div className="activity_list">
            <Paper className={classes.paper}>
                {props.activities && (
                    <Paper style={{ width: '100%', overflowX: 'auto' }}>
                        <Table id="activity_table" aria-label="simple table" className={classes.table} size="small">
                            <TableBody id="activity_table_body">
                                {props.activities.filter(filterActivities).map(activityItem => (
                                    <ActivityRow key={activityItem.id}
                                        activityItem={activityItem}
                                        isActive={activityItem.isActive}
                                        onMenuAction={props.onMenuAction}
                                        onToggleActive={props.onToggleActive} />
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                )}
            </Paper>
        </div>
    );
}