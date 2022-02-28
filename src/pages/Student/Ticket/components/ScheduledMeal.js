import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import makeStyles from "@material-ui/styles/makeStyles";

import HighlightOffIcon from "@material-ui/icons/HighlightOff";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  collapse: {
    backgroundColor: "#00000007",
  },
  allow: {
    width: "90.0px",
    backgroundColor: "#5DE2A5",
    //display: 'inline-block',
    color: "#393A68",
    textAlign: "center",
    height: "70px",
    boxSizing: "border-box",
    border: "1px solid #F2F2F2",
    minWidth: "80px",
    padding: "12px",
    fontWeight: "bold",
    fontSize: "14px",
  },
  justification: {
    width: "90.0px",
    backgroundColor: "#009be5",
    //display: 'inline-block',
    color: "#393A68",
    textAlign: "center",
    height: "70px",
    boxSizing: "border-box",
    border: "1px solid #F2F2F2",
    minWidth: "80px",
    padding: "12px",
    fontWeight: "bold",
    fontSize: "14px",
  },
  notPresent: {
    width: "90.0px",
    backgroundColor: "#F5A623",
    //display: 'inline-block',
    color: "#393A68",
    textAlign: "center",
    height: "70px",
    boxSizing: "border-box",
    border: "1px solid #F2F2F2",
    minWidth: "80px",
    padding: "12px",
    fontWeight: "bold",
    fontSize: "14px",
  },
  notAllow: {
    width: "90.0px",
    backgroundColor: "#F14D76",
    //display: 'inline-block',
    color: "#393A68",
    textAlign: "center",
    height: "70px",
    boxSizing: "border-box",
    border: "1px solid #F2F2F2",
    minWidth: "80px",
    padding: "12px",
    fontWeight: "bold",
    fontSize: "14px",
  },
}));

const ScheduledMeal = (props) => {
  const classes = useStyles();
  const {
    filter: value,
    value: result,
    onCancelScheduling,
    collapsable,
  } = props;

  return collapsable ? (
    <>
      <TableRow style={{ boxShadow: "0px 2px 2px #00000010" }}>
        <TableCell className={classes.headTable} colSpan={1}>
          {result.date.toString().substr(0, 10).split("-").reverse().join("/")}
        </TableCell>
        <TableCell className={classes.headTable}>
          {result.meal.description}
        </TableCell>
        {value === "to-use" ? (
          <TableCell className={classes.row}>
            <Tooltip title="Cancelar reserva">
              <IconButton aria-label="Cancelar" onClick={onCancelScheduling}>
                <HighlightOffIcon color="error" fontSize="large" />
              </IconButton>
            </Tooltip>
          </TableCell>
        ) : value === "used" ? (
          <TableCell align="center" className={classes.allow}>
            Utilizado
          </TableCell>
        ) : value === "no-used" ? (
          result.absenceJustification !== null ? (
            <TableCell className={classes.justification}>Justificado</TableCell>
          ) : (
            <TableCell className={classes.notPresent}>Não utilizado</TableCell>
          )
        ) : (
          <TableCell className={classes.notAllow}>Cancelado</TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell
          className={clsx(classes.headTable, classes.collapse)}
          style={{ paddingBlock: 0 }}
          colSpan={4}
        >
          <Box sx={{ margin: 5 }}>
            <Typography variant="subtitle2">Refeição:</Typography>
            <em>{result.menu ? result.menu.description : "Não Encontrado"}</em>
          </Box>
        </TableCell>
      </TableRow>
    </>
  ) : (
    <TableRow>
      <TableCell className={classes.headTable}>
        {result.date.toString().substr(0, 10).split("-").reverse().join("/")}
      </TableCell>
      <TableCell className={classes.headTable}>
        {result.menu ? result.menu.description : "Não Encontrado"}
      </TableCell>
      <TableCell className={classes.headTable}>
        {result.meal.description}
      </TableCell>
      {value === "to-use" ? (
        <TableCell className={classes.row}>
          <Tooltip title="Cancelar reserva">
            <IconButton aria-label="Cancelar" onClick={onCancelScheduling}>
              <HighlightOffIcon color="error" fontSize="large" />
            </IconButton>
          </Tooltip>
        </TableCell>
      ) : value === "used" ? (
        <TableCell align="center" className={classes.allow}>
          Utilizado
        </TableCell>
      ) : value === "no-used" ? (
        result.absenceJustification !== null ? (
          <TableCell className={classes.justification}>Justificado</TableCell>
        ) : (
          <TableCell className={classes.notPresent}>Não utilizado</TableCell>
        )
      ) : (
        <TableCell className={classes.notAllow}>Cancelado</TableCell>
      )}
    </TableRow>
  );
};

ScheduledMeal.propTypes = {
  filter: PropTypes.string,
  value: PropTypes.object,
  onCancelScheduling: PropTypes.func,
  collapsable: PropTypes.bool,
};

export default withRouter(React.memo(ScheduledMeal));
