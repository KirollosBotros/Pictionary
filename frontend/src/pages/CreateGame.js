import React, { Component } from 'react'

export class CreateGame extends Component {
    state = {
        name: '',
    }

    onChangeName = (e) => {
        this.setState({name: e.target.value});
    }

    onSubmit = (e) => {
        e.preventDefault();
        const element = document.getElementById("dd");
        const maxPlayers = element.options[element.selectedIndex].value;
        this.props.create(this.state.name, maxPlayers);
    }

    render() {
        const formStyle = {
            width: '20%',
            height: '30%',
            overflow: 'auto',
            margin: 'auto',
            position: 'absolute',
            top: '0',
            left: '0',
            bottom: '0',
            right: '0'
        }
        return (
            <div>
                <form style={formStyle} onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input onChange={this.onChangeName} 
                               className="form-control" 
                               aria-describedby="emailHelp" 
                               placeholder="Enter name" />
                    </div>
                    <label>Maximum Players:</label>
                    <div className="input-group mb-3">
                        <select id="dd" defaultValue={'DEFAULT'} className="custom-select">
                            <option value="DEFAULT" disabled>Enter number</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                        </select>
                    </div>
                <button type="submit" className="btn btn-primary">Create Game</button>
                </form>
            </div>
        )
    }
}

export default CreateGame