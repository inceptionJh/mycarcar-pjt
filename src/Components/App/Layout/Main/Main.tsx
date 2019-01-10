/**
 * 1주차 다해 - 레이아웃 메인 컴포넌트. 주로 이 컴포넌트의 내용이 업데이트되며 렌더링 됨.
 */

import "./Main.css";

import React, { Component } from "react";

import Home from "./Home/Home";
import LoginForm from "./Login/LoginForm";
import EditForm from "./EditAccount/EditForm";
import RegisterForm from "./RegisterForm/RegisterForm";
import RegisterTerms from "./RegisterTerms/RegisterTerms";
import Rental from "./Rental/Rental";
import { IHandlePage, IHandleEditUserInfomationBtnClick, IHandleAuth, IEditUserInfomation } from "../../App";
import SuperUser from "./SuperUser/SuperUser";
import EditUserInfomation from "./EditUserInfomation/EditUserInfomation";

interface IMainProps {
  editUserInfomation: IEditUserInfomation;

  isSidebarOpen: boolean;
  isSignedIn: boolean;

  handlePage: IHandlePage;
  handleAuth: IHandleAuth;
  handleEditUserInfomationBtnClick: IHandleEditUserInfomationBtnClick;
}

export default class Main extends Component<IMainProps> {
  constructor(props: IMainProps) {
    super(props);
  }

  // url 주소창의 endpoint에 따른 화면 전환
  render() {
    const pathname = location.pathname;
    const commonAttribute = {
      handlePage: this.props.handlePage,
      isSidebarOpen: this.props.isSidebarOpen,
    };

    switch (pathname) {
      case "/login":
        return <LoginForm {...commonAttribute} handleAuth={this.props.handleAuth} />;
      case "/terms":
        return <RegisterTerms {...commonAttribute} />;
      case "/register":
        return <RegisterForm {...commonAttribute} />;
      case "/edit_account":
        return <EditForm {...commonAttribute} handleAuth={this.props.handleAuth} />;
      case "/rental":
        return <Rental {...commonAttribute} />;
      case "/admin/user_information_management":
        return (
          <SuperUser
            {...commonAttribute}
            handleEditUserInfomationBtnClick={this.props.handleEditUserInfomationBtnClick}
          />
        );
      case "/admin/edit_user_infomation":
        return <EditUserInfomation {...commonAttribute} editUserInfomation={this.props.editUserInfomation} />;
      default:
        return <Home {...commonAttribute} />;
    }
  }
}
