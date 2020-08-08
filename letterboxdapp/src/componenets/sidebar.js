import React, { Component } from 'react';
import {fallDown as Menu} from 'react-burger-menu';

class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.changeActiveTab = this.changeActiveTab.bind(this);
    }

    

    changeActiveTab(user) {
        console.log('HERES USER', user);
        this.props.handleClick(user);
    }

    render() {
        
        return (
            <Menu pageWrapId={this.props.pageWrapId} outerContainerId={this.props.outerContainerId} isOpen={this.props.isOpen} customCrossIcon={false} disableCloseOnEsc disableOverlayClick noOverlay>
                {this.props.users.map(user => (
                    <a id={user} className="menu-item" onClick={() => this.changeActiveTab(user)}>{user}</a>
                ))}
                <a>Add Username</a>
            </Menu>
        );
    }
}

export default SideBar;