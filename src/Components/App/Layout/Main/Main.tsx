/**
 * 레이아웃 메인 컴포넌트. 주로 이 컴포넌트의 내용이 업데이트되며 렌더링 됨.
 */

import * as React from "react";
import { Home, RegisterForm, LoginForm, EditForm, RegisterTerms } from "./Content";
import { IMainProps } from "./IMain";
import "./Main.css";

class Main extends React.Component<IMainProps, {}> {
  constructor(props: IMainProps) {
    super(props);
  }

  // url 주소창의 endpoint에 따른 화면 전환
  render() {
    const isLoginPage = location.pathname === "/login";
    const isTermsPage = location.pathname === "/terms";
    const isRegisterPage = location.pathname === "/register";
    const isEditPage = location.pathname === "/edit_account";

    if (isLoginPage) {
      return (
        <LoginForm
          handleAuth={this.props.handleAuth}
          app={this.props.app}
          mainToggle={this.props.mainToggle}
        />
      );
    }

    if (isTermsPage) {
      return (
        <RegisterTerms app={this.props.app} mainToggle={this.props.mainToggle} />
      );
    }

    if (isRegisterPage) {
      return (
        <RegisterForm app={this.props.app} mainToggle={this.props.mainToggle} />
      );
    }

    if (isEditPage) {
      return (
        <EditForm
          handleAuth={this.props.handleAuth}
          app={this.props.app}
          mainToggle={this.props.mainToggle}
        />
      );
    }

    return <Home mainToggle={this.props.mainToggle} />;
  }
}

export default Main;
