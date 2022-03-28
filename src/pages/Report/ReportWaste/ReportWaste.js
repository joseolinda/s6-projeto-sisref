import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Padding } from "../../../components";
import { getErrorMessage } from "../../../helpers/error";
import api from "../../../services/api";

const useStyles = makeStyles((theme) => ({
  heading: {
    marginBottom: theme.spacing(2),
  },
  container: {
    "& .ck-editor__editable": {
      maxHeight: "50vh",
    },
  },
  saveButton: {
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
}));

const ReportWaste = (props) => {
  const [reportContent, setReportContent] = useState("");
  const [date, setDate] = useState(() =>
    moment(new Date()).format("YYYY-MM-DD")
  );

  const classes = useStyles();

  const handleChangeBaseDate = ({ target }) => {
    setDate(target.value);
  };

  const loadReportForDate = async () => {
    try {
      const response = await api.get("/report/list-waste", {
        params: {
          date,
        },
      });

      if (response.status === 202) {
        setReportContent("");
        return;
      }

      setReportContent(response.data.content);
    } catch (error) {
      loadAlert("error", getErrorMessage(error));
    }
  };

  const handleSaveReport = async () => {
    try {
      const response = await api.put("/report/add-waste-report", {
        date,
        content: reportContent,
      });

      if (response.status !== 201) {
        console.log(response.data);
      }

      loadAlert(
        "success",
        "Relatório de desperdício mensal salvo com sucesso."
      );
      loadReportForDate();
    } catch (error) {
      loadAlert("error", getErrorMessage(error));
    }
  };

  //configuration alert
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
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

  useEffect(() => {
    loadReportForDate();
  }, [date]);

  return (
    <Padding className={classes.container}>
      <Typography variant="h5" className={classes.heading}>
        Relatório de Desperdício Mensal
      </Typography>
      <TextField
        type="date"
        variant="outlined"
        label="Data"
        defaultValue={new Date().toISOString().slice(0, 10)}
        onChange={handleChangeBaseDate}
      />
      <Box sx={{ my: 1 }}>
        {/** @see https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/frameworks/react.html */}
        <CKEditor
          editor={ClassicEditor}
          data={reportContent}
          config={{
            toolbar: {
              items: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "|",
                "indent",
                "outdent",
                "|",
                "blockQuote",
                "insertTable",
                "undo",
                "redo",
              ],
              shouldNotGroupWhenFull: true,
            },
            language: "pt-br",
          }}
          onChange={(_, editor) => setReportContent(editor.getData())}
          className={classes.editor}
        />
      </Box>
      <Button
        startIcon={<SaveIcon />}
        color="primary"
        variant="contained"
        className={classes.saveButton}
        onClick={handleSaveReport}
      >
        Salvar
      </Button>
    </Padding>
  );
};

ReportWaste.propTypes = {};

export default ReportWaste;
