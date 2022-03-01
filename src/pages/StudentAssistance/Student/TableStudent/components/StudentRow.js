import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import withRouter from "react-router-dom/withRouter";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import makeStyles from "@material-ui/styles/makeStyles";
import PerfectScrollbar from "react-perfect-scrollbar";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";

import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import History from "@material-ui/icons/History";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Ballot from "@material-ui/icons/BallotOutlined";
import { Collapse } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  headTable: {
    fontWeight: "bold",
  },
  actions: {
    justifyContent: "flex-end",
  },
  row: {
    display: "flex",
    alignItems: "center",
  },
  actionRow: {
    justifyContent: "space-around",
  },
}));

const StudentRow = (props) => {
  const history = useHistory();
  const {
    student: result,
    onVerifyHistory: onVerifyHistoryDefault,
    onVerifyPermissions: onVerifyPermissionsDefault,
    onDelete: onDeleteDefault,
    onEdit: onEditDefault,
  } = props;
  const [onVerifyHistory, onVerifyPermissions, onDelete, onEdit] = [
    onVerifyHistoryDefault,
    onVerifyPermissionsDefault,
    onDeleteDefault,
    onEditDefault,
  ].map(
    (callback) =>
      function (...args) {
        if (!history.location.search.includes("query=")) {
          history.push(
            history.location.pathname +
              "?query=" +
              result.id.toString().padStart(6, "0")
          );
        }

        return callback(...args);
      }
  );
  const classes = useStyles();
  const responsive = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [collapseOpen, setCollapseOpen] = useState(() =>
    history.location.search.includes("query")
  );

  return responsive ? (
    <>
      <TableRow key={result.id} onClick={() => setCollapseOpen(!collapseOpen)}>
        <TableCell className={classes.headTable}>
          {result.id.toString().padStart(6, "0")}
        </TableCell>

        <TableCell className={classes.headTable}>{result.name}</TableCell>

        <TableCell>
          <IconButton aria-label="expand row" size="small">
            {collapseOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          colSpan={3}
          style={{ paddingBlock: 0, backgroundColor: "#f5f5f5" }}
        >
          <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" variant="head">
                    Matrícula
                  </TableCell>
                  <TableCell className={classes.headTable}>
                    {result.mat}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" variant="head">
                    E-mail
                  </TableCell>
                  <TableCell className={classes.headTable}>
                    <PerfectScrollbar
                      style={{ maxWidth: "30vw", paddingBlock: "1rem" }}
                    >
                      {result.user[0] ? result.user[0].email : ""}
                    </PerfectScrollbar>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" variant="head">
                    Curso
                  </TableCell>
                  <TableCell className={classes.headTable}>
                    {result.course ? result.course.initials : ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" variant="head">
                    Validade
                  </TableCell>
                  <TableCell className={classes.headTable}>
                    {result.dateValid
                      .toString()
                      .substr(0, 10)
                      .split("-")
                      .reverse()
                      .join("/")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.headTable} colSpan={3}>
                    {result.active == 1 ? "Ativo" : "Inativo"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className={clsx(classes.row, classes.actionRow)}
                    colSpan={3}
                    style={{ border: 0 }}
                  >
                    <Box className={clsx(classes.row, classes.actionRow)}>
                      <Tooltip title="Verificar histórico de refeições">
                        <Button
                          className={classes.buttonDelete}
                          onClick={onVerifyHistory}
                        >
                          <History fontSize="medium" />
                        </Button>
                      </Tooltip>

                      <Tooltip title="Deletar">
                        <Button
                          className={classes.buttonDelete}
                          onClick={onDelete}
                        >
                          <Delete fontSize="medium" />
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className={clsx(classes.row, classes.actionRow)}
                    colSpan={3}
                    style={{ border: 0 }}
                  >
                    <Box className={clsx(classes.row, classes.actionRow)}>
                      <Tooltip title="Verificar permissões das refeições">
                        <Button
                          className={classes.buttonDelete}
                          onClick={onVerifyPermissions}
                        >
                          <Ballot fontSize="medium" />
                        </Button>
                      </Tooltip>

                      <Tooltip title="Editar">
                        <Button className={classes.buttonEdit} onClick={onEdit}>
                          <Edit fontSize="medium" />
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  ) : (
    <TableRow key={result.id}>
      <TableCell className={classes.headTable}>
        {result.id.toString().padStart(6, "0")}
      </TableCell>
      <TableCell className={classes.headTable}>{result.mat}</TableCell>
      <TableCell className={classes.headTable}>{result.name}</TableCell>
      <TableCell className={classes.headTable}>
        {result.user[0] ? result.user[0].email : ""}
      </TableCell>
      <TableCell className={classes.headTable}>
        {result.course ? result.course.initials : ""}
      </TableCell>
      <TableCell className={classes.headTable}>
        {result.dateValid
          .toString()
          .substr(0, 10)
          .split("-")
          .reverse()
          .join("/")}
      </TableCell>
      <TableCell className={classes.headTable}>
        {result.active == 1 ? "Ativo" : "Inativo"}
      </TableCell>
      <TableCell className={classes.row}>
        <Tooltip title="Verificar histórico de refeições">
          <Button className={classes.buttonDelete} onClick={onVerifyHistory}>
            <History fontSize="medium" />
          </Button>
        </Tooltip>
        <Tooltip title="Verificar permissões das refeições">
          <Button
            className={classes.buttonDelete}
            onClick={onVerifyPermissions}
          >
            <Ballot fontSize="medium" />
          </Button>
        </Tooltip>
      </TableCell>
      <TableCell className={classes.row}>
        <Tooltip title="Deletar">
          <Button className={classes.buttonDelete} onClick={onDelete}>
            <Delete fontSize="medium" />
          </Button>
        </Tooltip>
        <Tooltip title="Editar">
          <Button className={classes.buttonEdit} onClick={onEdit}>
            <Edit fontSize="medium" />
          </Button>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

StudentRow.propTypes = {
  student: PropTypes.object,
  onVerifyHistory: PropTypes.func,
  onVerifyPermissions: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

export default withRouter(StudentRow);
