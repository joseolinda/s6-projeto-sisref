import styled from "styled-components";
//npm install @material-ui/coreimport { makeStyles } from '@material-ui/core/styles'; 

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  img{
    width: 100px;
    heigt: 250;
  }
`;

export const Footer = styled.footer`
  position:absolute;
  bottom:0;
  width:80%;
`;

export default Footer;