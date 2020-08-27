import React from 'react';

class UserTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            buttonFill: false
        };

        this.removeUser = this.removeUser.bind(this);
        this.changeActiveTab = this.changeActiveTab.bind(this);
        this.buttonChange = this.buttonChange.bind(this);
    }

    removeUser(user) {
        this.props.removeUser(user);
    }

    changeActiveTab(user) {
        this.props.changeActiveTab(user);
    }

    buttonChange() {
        this.setState({buttonFill: !this.state.buttonFill});
    }


    render() {
        let button;
        let user = this.props.user;
        if(this.state.buttonFill) {
            button = ( 
                <svg width="1.5vw" height="1.5vw" viewBox="0 0 16 16" className="bi bi-x-square-fill" id="adduser" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onClick={() => this.removeUser(user)} onMouseLeave={this.buttonChange}>
                    <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm9.854 4.854a.5.5 0 0 0-.708-.708L8 7.293 4.854 4.146a.5.5 0 1 0-.708.708L7.293 8l-3.147 3.146a.5.5 0 0 0 .708.708L8 8.707l3.146 3.147a.5.5 0 0 0 .708-.708L8.707 8l3.147-3.146z"/>
                </svg>
            );
        } else {
            button = ( 
                <svg width="1.5vw" height="1.5vw" viewBox="0 0 16 16" className="bi bi-x-square" id="adduser" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onMouseEnter={this.buttonChange}>
                    <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
                    <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
                </svg>
            );
        }
        return ( 
            <div className="bm-item" >
                {button}
                <a id="username" className="menu-item" onClick={() => this.changeActiveTab(user)}>{user}</a>
            </div>
         );
    }
}
 
export default UserTab;