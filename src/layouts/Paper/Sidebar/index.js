import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import api from '../../../../src/services/api';
import Swal from "sweetalert2";
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import EmojiFoodBeverageIcon from '@material-ui/icons/EmojiFoodBeverage';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Grid';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import MoreIcon from '@material-ui/icons/More';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import PublicIcon from '@material-ui/icons/Public';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import AssessmentIcon from '@material-ui/icons/Assessment';
import Navigator from "./Navigator";
import SchoolIcon from '@material-ui/icons/School';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import ContactsIcon from '@material-ui/icons/Contacts';
import LaunchIcon from '@material-ui/icons/Launch';
import { getErrorMessage } from '../../../helpers/error';

const categoriesAdmin = [
    {
        id: 'Admin', href: '/admin',
        children: [
            { id: 'Usuários', icon: <PeopleIcon />, href: '/user' },
            { id: 'Campi',   title: 'Campi', href: '/campus', icon: <PublicIcon /> },
            { id: 'Sobre', href:'https://docs.google.com/document/d/1eIyVxD0hjBwFcsdJChhDHA7OHWIcdIojTLNTHqmPZiQ/edit?usp=sharing', icon: <LaunchIcon /> },
        ],
    },
];

const categoriesAssistenciaEstudantil = [
    {
        id: 'Menu',
        children: [
            { id: 'Turnos', icon: <DragIndicatorIcon />, href:'/shift'},
            { id: 'Cursos', href:'/course', icon: <SchoolIcon /> },
            { id: 'Repúblicas', href:'/republic', icon: <HomeWorkIcon /> },
            { id: 'Alunos', href:'/student', icon: <PeopleOutlineIcon /> },
            { id: 'Agendamento', href: '/scheduling', icon: <CalendarTodayIcon /> },
            { id: 'Relatório de refeições', href:'/meals-report', icon: <AssessmentIcon /> },
            { id: 'Sobre', href:'https://docs.google.com/document/d/1eIyVxD0hjBwFcsdJChhDHA7OHWIcdIojTLNTHqmPZiQ/edit?usp=sharing', icon: <LaunchIcon /> },
        ],
    }
];

const categoriesNutritionist = [
    {
        id: 'Menu',
        children: [
            { id: 'Cardápios', icon: <RestaurantMenuIcon />, href: '/menu' },
            { id: 'Refeições', href: '/meal', icon: <FastfoodIcon /> },
            { id: 'Relatório de refeições', href:'/nutri-meals-report', icon: <AssessmentIcon /> },
            { id: 'Quantidade de reservas', href:'/registered', icon: <ContactsIcon /> },
            { id: 'Sobre', href:'https://docs.google.com/document/d/1eIyVxD0hjBwFcsdJChhDHA7OHWIcdIojTLNTHqmPZiQ/edit?usp=sharing', icon: <LaunchIcon /> },
        ],
    },
];

const categoriesReception = [
    {
        id: 'Menu',
        children: [
            { id: 'Registrar refeição', icon: <EmojiFoodBeverageIcon />, href: '/confirm-meals' },
            { id: 'Relatório de refeições', href:'/reception-meals-report', icon: <AssessmentIcon /> },
            { id: 'Sobre', href:'https://docs.google.com/document/d/1eIyVxD0hjBwFcsdJChhDHA7OHWIcdIojTLNTHqmPZiQ/edit?usp=sharing', icon: <LaunchIcon /> },
        ],
    },
];

const categoriesStudent = [
    {
        id: 'Menu',
        children: [
            { id: 'Home', icon: <HomeIcon/>, href: '/page-student' },
            { id: 'Informações acadêmicas', href: '/information-student', icon: <SchoolIcon /> },
            { id: 'Tickets', icon: <ConfirmationNumberIcon />, href: '/tickets' },
            { id: 'Sobre', href:'https://docs.google.com/document/d/1eIyVxD0hjBwFcsdJChhDHA7OHWIcdIojTLNTHqmPZiQ/edit?usp=sharing', icon: <LaunchIcon /> },
        ],
    },
];

const styles = (theme) => ({
    categoryHeader: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    categoryHeaderPrimary: {
        color: theme.palette.common.white,
    },
    item: {
        paddingTop: 1,
        paddingBottom: 1,
        color: 'rgba(255, 255, 255, 0.7)',
        '&:hover,&:focus': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
    },
    itemCategory: {
        backgroundColor: '#232f3e',
        boxShadow: '0 -1px 0 #404854 inset',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    firebase: {
        fontSize: 24,
        color: theme.palette.common.white,
    },
    itemActiveItem: {
        color: '#4fc3f7',
    },
    itemPrimary: {
        fontSize: 'inherit',
    },
    itemIcon: {
        minWidth: 'auto',
        marginRight: theme.spacing(2),
    },
    divider: {
        marginTop: theme.spacing(2),
    },
});

const Sidebar = (props) => {
    const { classes, ...other } = props;

    const level_user = localStorage.getItem("@rucedro-acess-level-user");
    const name_user = localStorage.getItem("@rucedro-name-user");

    const [campus, setCampus] = useState([]);

     //configuration alert
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

    function loadAlert(icon, message) {
        Toast.fire({
          icon: icon,
          title: message
        });
      }

    async function loadCampus(){
        try {
          let url = 'all/campus';
          const response = await api.get(url);
          setCampus(response.data);
        } catch (error) {
          loadAlert('error', getErrorMessage (error));
        }
    }

    useEffect(()=>{
        loadCampus()
    },[level_user]);

    return (
      <Drawer variant="permanent" {...other}>
        <List disablePadding>
          <ListItem
            className={clsx(
              classes.firebase,
              classes.item,
              classes.itemCategory
            )}
          >
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Link
                component="a"
                href="https://www.ifce.edu.br/"
                target="_blank"
              >
                <img alt="Logo" src="/images/LOGO-Horizontal.png" />
              </Link>
              <Typography variant="body1">
                {"Olá, " + name_user + ". Tudo bem?"}
              </Typography>
            </Grid>
          </ListItem>
          <ListItem className={clsx(classes.item, classes.itemCategory)}>
            <ListItemIcon className={classes.itemIcon}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.itemPrimary,
              }}
            >
              SisRef | Campus - {campus.description}
            </ListItemText>
          </ListItem>
          {level_user === "ADMIN"
            ? categoriesAdmin.map((result) => (
                <Navigator key={result.id} category={result} />
              ))
            : level_user === "ASSIS_ESTU"
            ? categoriesAssistenciaEstudantil.map((result) => (
                <Navigator key={result.id} category={result} />
              ))
            : level_user === "RECEPCAO"
            ? categoriesReception.map((result) => (
                <Navigator key={result.id} category={result} />
              ))
            : level_user === "NUTRI"
            ? categoriesNutritionist.map((result) => (
                <Navigator key={result.id} category={result} />
              ))
            : categoriesStudent.map((result) => (
                <Navigator key={result.id} category={result} />
              ))}
        </List>
      </Drawer>
    );
}

Sidebar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Sidebar));
