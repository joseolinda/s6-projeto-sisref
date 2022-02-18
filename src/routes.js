import React from 'react';

import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';

import {RouteWithLayout} from './components';
import { Minimal as MinimalLayout, Paperbase, Print } from './layouts';

import SignIn from "./pages/SignIn";
import HomeStudent from "./pages/Student/Home"
import Admin from './pages/Admin/Home';
import Erro404 from './pages/Erro404';
import Erro401 from './pages/Erro401';
import CampusDetails from './pages/Admin/Campus/CampusDetails';
import UserDetails from './pages/Admin/User/UserDetails';
import TableCampus from './pages/Admin/Campus/TableCampus';
import TableUser from './pages/Admin/User/TableUser';
import Nutritionist from './pages/Nutritionist/Home';
import TableCourse from "./pages/StudentAssistance/Course/TableCourse";
import CourseDetails from "./pages/StudentAssistance/Course/CourseDetails";
import TableShift from "./pages/StudentAssistance/Shift/TableShift";
import ShiftDetails from "./pages/StudentAssistance/Shift/ShiftDetails";
import TableStudent from "./pages/StudentAssistance/Student/TableStudent";
import StudentDetails from "./pages/StudentAssistance/Student/StudentDetails";
import StudentHistory from "./pages/StudentAssistance/Student/StudentHistory";
import TableRepublic from './pages/StudentAssistance/Republic/TableRepublic';
import RepublicDetails from './pages/StudentAssistance/Republic/RepublicDetails';
import TableMeal from './pages/Nutritionist/Meal/TableMeal';
import MealDetails from './pages/Nutritionist/Meal/MealDetails';
import TableMenu from './pages/Nutritionist/Menu/TableMenu';
import MenuDetails from './pages/Nutritionist/Menu/MenuDetails';
import StudentAllowMeal from "./pages/StudentAssistance/Student/StudentAllowMeal/StudentAllowMeal";
import ReportScheduling from "./pages/Report/ReportScheduling";
import RedefinePassword from "./pages/RedifinePassword";
import ResetPassword from "./pages/ResetPassword";
import TableConfirmMeal from './pages/Reception/ConfirmMeal';
import SchedulingMeal from './pages/Scheduling/SchedulingMeal/SchedulingMeal';
import InformationStudent from './pages/Student/Information/InformationStudent';
import TicketStudent from './pages/Student/Ticket/Ticket';
import RegisteredMeals from './pages/Nutritionist/RegisteredMeals';
import ReportPrint from './pages/Report/ReportPrint';

  const Routes = () => (
    <BrowserRouter basename={process.env.PROCESS_URL}>
      <Switch>
        <Redirect
            exact
            from="/"
            to="/sign-in"
        />
        {/*ROTAS COMUNS*/}
        <RouteWithLayout
            component={SignIn}
            exact
            layout={MinimalLayout}
            needToBeLogged={false}
            path="/sign-in"/>
        <RouteWithLayout
            component={RedefinePassword}
            exact
            layout={MinimalLayout}
            needToBeLogged={false}
            path="/redefine-password"/>
        <RouteWithLayout
            component={ResetPassword}
            exact
            layout={MinimalLayout}
            needToBeLogged={false}
            path="/reset-password/:token"/>
        {/*ROTAS DO ADMINISTRADOR*/}
          {/*ROTAS CAMPUS*/}
        <RouteWithLayout
            component={Admin}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ADMIN"
            path="/admin"/>
          <RouteWithLayout
            component={TableCampus}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ADMIN"
            path="/campus"/>
          <RouteWithLayout
            component={CampusDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ADMIN"
            path="/campus-details"/>
          <RouteWithLayout
            component={CampusDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ADMIN"
            path="/campus-details/:idCampus"/>
          {/*ROTAS USER*/}
          <RouteWithLayout
            component={TableUser}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ADMIN"
            path="/user"/>
          <RouteWithLayout
            component={UserDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ADMIN"
            path="/user-details"/>
          <RouteWithLayout
            component={UserDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ADMIN"
            path="/user-details/:idUser"/>
        {/*ROTAS DA ASSITÊNCIA ESTUDANTIL*/}
        <RouteWithLayout
            component={Admin}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/student-assistance"/>
        <RouteWithLayout
            component={TableCourse}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/course"/>
        <RouteWithLayout
            component={CourseDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/course-details"/>
        <RouteWithLayout
            component={CourseDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/course-details/:idCourse"/>
        <RouteWithLayout
            component={TableShift}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/shift"/>
        <RouteWithLayout
            component={ShiftDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/shift-details"/>
        <RouteWithLayout
            component={ShiftDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/shift-details/:idShift"/>
        <RouteWithLayout
            component={TableStudent}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/student"/>
        <RouteWithLayout
            component={StudentDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/student-details"/>
        <RouteWithLayout
            component={StudentDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/student-details/:idStudent"/>
        <RouteWithLayout
            component={StudentHistory}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/student-history/:idStudent"/>
        <RouteWithLayout
            component={StudentAllowMeal}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/student-allow-meal/:idStudent"/>
        <RouteWithLayout
            component={TableRepublic}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/republic"/>
        <RouteWithLayout
            component={RepublicDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/republic-details"/>
        <RouteWithLayout
            component={RepublicDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/republic-details/:idRepublic"/>
          <RouteWithLayout
            component={ReportScheduling}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/meals-report"/>
        <RouteWithLayout
            component={ReportPrint}
            exact
            layout={Print}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/report-print"/>
        <RouteWithLayout
            component={SchedulingMeal}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="ASSIS_ESTU"
            path="/scheduling"/>
        {/*ROTAS DA NUTRICIONISTA*/}
        <RouteWithLayout
            component={Nutritionist}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="NUTRI"
            path="/nutritionist"/>  
        <RouteWithLayout
            component={TableMeal}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="NUTRI"
            path="/meal"/>
        <RouteWithLayout
            component={MealDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="NUTRI"
            path="/meal-details"/>
        <RouteWithLayout
            component={MealDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="NUTRI"
            path="/meal-details/:idMeal"/>
        <RouteWithLayout
            component={TableMenu}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="NUTRI"
            path="/menu"/>
        <RouteWithLayout
            component={MenuDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="NUTRI"
            path="/menu-details"/>
        <RouteWithLayout
            component={MenuDetails}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="NUTRI"
            path="/menu-details/:idMenu"/>
        <RouteWithLayout
            component={ReportScheduling}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="NUTRI"
            path="/nutri-meals-report"/>
        <RouteWithLayout
            component={RegisteredMeals}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="NUTRI"
            path="/registered"/>
        <RouteWithLayout
            component={ReportPrint}
            exact
            layout={Print}
            needToBeLogged={true}
            typeUser="NUTRI"
            path="/report-prints"/> 
        {/*ROTAS DA RECEPCÕA*/}
        <RouteWithLayout
            component={Admin}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="RECEPCAO"
            path="/reception"/>
        <RouteWithLayout
            component={ReportScheduling}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="RECEPCAO"
            path="/reception-meals-report"/>
        <RouteWithLayout
            component={TableConfirmMeal}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="RECEPCAO"
            path="/confirm-meals"/>
        {/*ROTAS DO ESTUDANTE*/}
        <RouteWithLayout
            component={HomeStudent}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="STUDENT"
            path="/page-student"/>
        <RouteWithLayout
            component={InformationStudent}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="STUDENT"
            path="/information-student"/>
        <RouteWithLayout
            component={TicketStudent}
            exact
            layout={Paperbase}
            needToBeLogged={true}
            typeUser="STUDENT"
            path="/tickets"/>
        {/*ROTAS DE ERROS*/}
        <RouteWithLayout
            component={Erro401}
            exact
            layout={MinimalLayout}
            needToBeLogged={false}
            path="/Unauthorized"/>
        <RouteWithLayout
            component={Erro404}
            exact
            layout={MinimalLayout}
            needToBeLogged={false}
            path="/*"/>
      </Switch>
    </BrowserRouter>
  );

export default Routes;
