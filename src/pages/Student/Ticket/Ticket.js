import {
  Button,
  Card,
  CardActions,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import "moment/locale/pt-br";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import { DialogQuestione, Padding } from "../../../components";
import api from "../../../services/api";
import ScheduledMeal from "./components/ScheduledMeal";

const useStyles = makeStyles((theme) => ({
  root: {},
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  grupButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      marginBlock: theme.spacing(1),
    },
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  responsiveContent: {
    [theme.breakpoints.down("md")]: {
      paddingInline: "8px",
    },
  },
}));

const Ticket = (props) => {
  const largeButtonGroup = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const collapsableCell = useMediaQuery((theme) =>
    theme.breakpoints.down("sm")
  );
  const { className, history } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState("to-use");
  const [schedulingsMeal, setSchedulingsMeal] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dateMel, setDateMeal] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [idMealCanceled, setIdMealCanceled] = React.useState(0);

  //configuration alert
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  function loadAlert(icon, message) {
    Toast.fire({
      icon: icon,
      title: message,
    });
  }

  async function loadschedulingsMeal(page) {
    setLoading(true);
    try {
      let url = "student/schedulings";
      if (value === "to-use") {
        url += "/to-use?page=" + page;
      } else if (value === "used") {
        url += "/used?page=" + page;
      } else if (value === "no-used") {
        url += "/not-used?page=" + page;
      } else if (value === "canceled") {
        url += "/canceled?page=" + page;
      }
      const response = await api.get(url);
      setTotal(response.data.total);
      setSchedulingsMeal(response.data.data);
    } catch (error) {
      console.log("erro função", error);
      loadAlert("error", "Erro de conexão.");
    }
    setLoading(false);
  }

  async function handleMealCancel() {
    const meal_id = idMealCanceled;
    const date = dateMel;
    const data = {
      meal_id,
      date,
    };
    let response = {};
    try {
      response = await api.put("student/schedulings/cancel", data);
      if (response.status === 202) {
        if (response.data.message) {
          loadAlert("error", response.data.message);
        }
      } else {
        loadAlert("success", "Reserva cancelada.");
      }
    } catch (error) {
      console.log(error);
      loadAlert("error", "Erro de conexão.");
    }
    setOpen(false);
    loadschedulingsMeal(1);
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handlePageChange = (event, page) => {
    loadschedulingsMeal(page + 1);
    setPage(page);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const onClickOpenDialog = (id, date) => {
    setIdMealCanceled(id);
    setDateMeal(date);
    setOpen(true);
  };

  const onClickCloseDialog = () => {
    setOpen(false);
    setIdMealCanceled(0);
  };

  useEffect(() => {
    loadschedulingsMeal(1);
  }, [value]);

  return (
    <Padding>
      <div className={classes.root}>
        <div className={classes.grupButton}>
          <ButtonGroup
            size={largeButtonGroup ? "large" : "small"}
            orientation="horizontal"
            color="primary"
            variant="contained"
            aria-label=" outlined primary button group"
          >
            <Tooltip title="É listado os Tickets que ainda não foram utilizados e não venceram.">
              <Button
                onClick={(event, newValue) => {
                  setValue("to-use");
                }}
              >
                A ser usados
              </Button>
            </Tooltip>
            <Tooltip title="É listado os Tickets das refeições que o estudante esteve presente.">
              <Button
                onClick={(event, newValue) => {
                  setValue("used");
                }}
              >
                Usados
              </Button>
            </Tooltip>
            <Tooltip title="É listado os Tickets que o estudante não utilizou e se venceram ou que foram justificados.">
              <Button
                onClick={(event, newValue) => {
                  setValue("no-used");
                }}
              >
                Não usados
              </Button>
            </Tooltip>
            <Tooltip title="É listado os Tickets que foram cancelados pelo estudante.">
              <Button
                onClick={(event, newValue) => {
                  setValue("canceled");
                }}
              >
                Cancelados
              </Button>
            </Tooltip>
          </ButtonGroup>
        </div>

        <div className={classes.content}>
          <Card className={clsx(classes.root, className)}>
            <CardContent
              className={clsx(classes.content, classes.responsiveContent)}
            >
              <div className={classes.inner}>
                {loading === true ? (
                  <LinearProgress />
                ) : schedulingsMeal == "" ? (
                  <Table>
                    <TableBody>
                      <TableRow key={0}>
                        <TableCell
                          align="center"
                          colSpan={9}
                          className={classes.headTable}
                        >
                          {" "}
                          Nenhum dado foi encontrado para a pesquisa realizada!
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.headTable}>
                          Data{" "}
                        </TableCell>
                        {!collapsableCell && (
                          <TableCell className={classes.headTable}>
                            Refeição
                          </TableCell>
                        )}
                        <TableCell className={classes.headTable}>
                          Cardápio
                        </TableCell>
                        <TableCell className={classes.headTable}> - </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schedulingsMeal.map((result) => (
                        <ScheduledMeal
                          key={result.id}
                          value={result}
                          filter={value}
                          collapsable={collapsableCell}
                        />
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
            <CardActions className={classes.actions}>
              <TablePagination
                component="div"
                count={total}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10]}
              />
            </CardActions>
          </Card>
          <DialogQuestione
            handleClose={onClickCloseDialog}
            open={open}
            onClickAgree={handleMealCancel}
            onClickDisagree={onClickCloseDialog}
            mesage={
              "Deseja realmente cancelar a reserva ? Uma vez cancelada não poderá mais solicitar"
            }
            title={"Cancelar reserva"}
          />
        </div>
      </div>
    </Padding>
  );
};
Ticket.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object,
};

export default withRouter(Ticket);
