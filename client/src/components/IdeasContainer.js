import React from 'react';
import axios from 'axios';
import Idea from './Idea';
import update from 'immutability-helper';
import IdeaForm from './IdeaForm';

const API_URL = "https://simon-ideaboard-api.herokuapp.com/api/v1/ideas";

class IdeasContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ideas: [],
      editingIdeaId: null,
      notification: ''
    };
  }

  componentDidMount() {
    axios.get(API_URL)
      .then(response => {
        this.setState({ideas: response.data})
      })
      .catch(error => console.log(error))
  };

  addNewIdea = () => {
    axios.post(
      API_URL,
      { idea:
        {
          title: '',
          body: ''
        }
      }
    )
    .then(response => {
      const ideas = update(this.state.ideas, {
        $splice: [[0, 0, response.data]]
      })
      this.setState({
        ideas: ideas,
        editingIdeaId: response.data.id
      })
    })
    .catch(error => console.log(error));

  }

  updateIdea = (idea) => {
    const ideaIndex = this.state.ideas.findIndex(x => x.id === idea.id);
    const ideas = update(this.state.ideas, {
      [ideaIndex]: {$set: idea}
    })
    this.setState({
      ideas: ideas,
      notification: 'All changes saved'
    })
  };

  resetNotification = () => {
    this.setState({notification: ''});
  };

  enableEditing = (id) => {
    this.setState({editingIdeaId: id},
      () => {this.title.focus() });
  };

  deleteIdea = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(response => {
        const ideaIndex = this.state.ideas.findIndex(x => x.id === id)
        const ideas = update(this.state.ideas, { $splice: [[ideaIndex, 1]]})
        this.setState({ideas: ideas})
      })
      .catch(error => console.log(error))
  }

  render() {
    let ideas = this.state.ideas

    return (
      <div className="idea-container">
        <button className="tile newIdeaButton"
        onClick={this.addNewIdea} >
          New Idea
        </button>
        <span className="notification">
          {this.state.notification}
        </span>
        {ideas.map((idea) => {
          if(this.state.editingIdeaId === idea.id) {
            return (<IdeaForm idea={idea} key={idea.id}
              updateIdea={this.updateIdea}
              resetNotification={this.resetNotification}
              titleRef={ input => this.title = input} />)
          } else {
            return (<Idea idea={idea} key={idea.id}
              onClick={this.enableEditing}
              onDelete={this.deleteIdea} />)
          }
        })}
      </div>
    )
  }
}

export default IdeasContainer;
