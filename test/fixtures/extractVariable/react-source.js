import React, {Component} from "react";
import { withRouter, Link, Redirect  } from "react-router-dom";
import { observer, inject } from "mobx-react";
import cn from "classnames";
import Guest from "./Guest";
import Member from "./Member";

import Routes from '../Routes';

import styles from "./index.sass";


@inject("user") @observer
class Application extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.user.signIn();
  }

  testFn() {
    console.log('blerg');
  }

  guestOrMember() {
    const {user} = this.props;
    if (user.signedIn){
      return(<Member />);
    }

    return(<Guest />);
  }

  render() {

    return (
      <div id="Layout container" className={styles.layout}>
        <div className={cn("pure-menu", "pure-menu-horizontal", "pure-menu-fixed", styles.mainNav)}>
          <Link className={cn("pure-menu-heading", styles.heading)} to="/">Invoiced</Link>
          {this.guestOrMember()}
        </div>
        <Routes />
      </div>
    );
  }
}

export default withRouter(Application);
