import React, { Component } from 'react'

export class JoinForm extends Component {
    state = {
        name: '', 
        gameCode: ''
    };

    onChangeCode = (e) => {
        this.setState({gameCode: e.target.value});
    }

    onChangeName = (e) => {
        this.setState({name: e.target.value});
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.join(this.state.gameCode, this.state.name);
    }

    render() {
        const formStyle = {
            display: 'inline-block',
            position: 'absolute',
            top: '40%',
            left: '42%'
        }
        return (
            <div>
                <form style={formStyle} onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input onChange={this.onChangeName} className="form-control" aria-describedby="emailHelp" placeholder="Enter name" />
                    </div>
                <div className="form-group">
                    <label>Game Code:</label>
                    <input onChange={this.onChangeCode} className="form-control" placeholder="Game code" />
                </div>
                <button type="submit" className="btn btn-primary">Join Game</button>
                </form>
            </div>
        )
    }
}

export default JoinForm