import React from 'react';
import {fallDown as Menu} from 'react-burger-menu';

class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputBox: false,
            buttonFill: false,
            inputRef: 'input'
        }

        this.changeActiveTab = this.changeActiveTab.bind(this);
        this.changeTypedValue = this.changeTypedValue.bind(this);
        this.submitUsername = this.submitUsername.bind(this);
        this.changeToInputBox = this.changeToInputBox.bind(this);
        this.fillUserButton = this.fillUserButton.bind(this);
        this.drainUserButton = this.drainUserButton.bind(this);
        this.clearTypedValue = this.clearTypedValue.bind(this);
        this.removeUser = this.removeUser.bind(this);
    }

    
    changeActiveTab(user) {
        this.props.handleClick(user);
    }

    changeTypedValue(event) {
        this.props.handleChange(event);
    }

    submitUsername(event) {
        this.props.handleSubmit(event);
        this.setState({inputBox: false});
    }

    clearTypedValue() {
        this.props.clearTypedValue();
        this.setState({
            inputBox: false,
            buttonFill: false
        })
    }

    removeUser(user) {
        this.props.deleteUsername(user);
    }

    changeToInputBox() {
        this.setState({
            inputBox: !this.state.inputBox,
            buttonFill: false
        });
    }

    fillUserButton() {
        this.setState({buttonFill: true});
    }

    drainUserButton() {
        this.setState({buttonFill:false});
    }

    render() {
        let addUserForm;
        let userButton;

        if(this.state.buttonFill) {
            if(this.state.inputBox) {
                userButton = (
                    <svg width="1.5vw" height="1.5vw" viewBox="0 0 16 16" className="bi bi-x-square-fill" id="adduser" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onClick={this.clearTypedValue}>
                        <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm9.854 4.854a.5.5 0 0 0-.708-.708L8 7.293 4.854 4.146a.5.5 0 1 0-.708.708L7.293 8l-3.147 3.146a.5.5 0 0 0 .708.708L8 8.707l3.146 3.147a.5.5 0 0 0 .708-.708L8.707 8l3.147-3.146z"/>
                    </svg>
                );
            } else {
                userButton = (
                    <svg width="1.5vw" height="1.5vw" viewBox="0 0 16 16" className="bi bi-plus-square-fill" id="adduser" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onClick={this.changeToInputBox}>
                        <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4a.5.5 0 0 0-1 0v3.5H4a.5.5 0 0 0 0 1h3.5V12a.5.5 0 0 0 1 0V8.5H12a.5.5 0 0 0 0-1H8.5V4z"/>
                    </svg>
                )
            }
            
        } else {
            if(this.state.inputBox) {
                userButton = (
                    <svg width="1.5vw" height="1.5vw" viewBox="0 0 16 16" className="bi bi-x-square" id="adduser" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
                        <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
                    </svg>
                )
            } else {
                userButton = (
                    <svg width="1.5vw" height="1.5vw" viewBox="0 0 16 16" className="bi bi-plus-square" id="adduser" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
                        <path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
                        <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    </svg>
                );
            }
        }

        if(this.state.inputBox) {
            addUserForm = (
                <form onSubmit={this.submitUsername}>
                    <div onMouseEnter={this.fillUserButton} onMouseLeave={this.drainUserButton}>{userButton}</div>
                    <input autoFocus className="inputbox" type="text" value={this.props.typedValue} onChange={this.changeTypedValue}/>
                </form>   
            )
        } else {
            addUserForm = (
                <a onClick={this.changeToInputBox} onMouseEnter={this.fillUserButton} onMouseLeave={this.drainUserButton}>
                    {userButton}
                    <a className="addUserText">Add Username</a>
                </a>
            );
        }
        
        return (
            <Menu pageWrapId={this.props.pageWrapId} outerContainerId={this.props.outerContainerId} isOpen={this.props.isOpen} customCrossIcon={false} disableAutoFocus disableCloseOnEsc disableOverlayClick noOverlay>
                {this.props.users.map(user => (
                    <div>
                    <svg width="1.5vw" height="1.5vw" viewBox="0 0 16 16" className="bi bi-x-square-fill" id="adduser" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onClick={() => this.removeUser(user)}>
                        <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm9.854 4.854a.5.5 0 0 0-.708-.708L8 7.293 4.854 4.146a.5.5 0 1 0-.708.708L7.293 8l-3.147 3.146a.5.5 0 0 0 .708.708L8 8.707l3.146 3.147a.5.5 0 0 0 .708-.708L8.707 8l3.147-3.146z"/>
                    </svg>
                    <a id={user} className="menu-item" onClick={() => this.changeActiveTab(user)}>{user}</a>
                    </div>
                ))}
                {addUserForm}
            </Menu>
        );
    }
}

export default SideBar;