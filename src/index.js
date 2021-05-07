import React, {Component} from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

class Quiz extends Component {

	constructor() {
		super();
		this.state = {
		  question: {answerOptions: []},
		  selected: ""
		};
	  }

	getQuestion = () => {
		fetch('https://still-dawn-36166.herokuapp.com/admin/questions', {mode: 'cors'})
			.then(response => response.json())
			.then(data => this.setState({question: 
				{questionText: data.fact, 
				answerOptions: data.options.map((opt) => { return {answerText: opt, isCorrect: (opt === data.answer) } ; })}
			}))
	};

	// componentDidMount function to get question
	componentDidMount() {
		this.nextQuestion();
	}

	nextQuestion = () => {
		this.getQuestion();
		this.setState({selected: ""});
	};

	render() {
		return (
			<div >
				<div className='app'>
						<div className='question-section'>
							<div className='question-count'>
								<span>Quién es: </span>
							</div>
							<div className='question-text'>{this.state.question.questionText}</div>
						</div>
						<div className='answer-section'>
							{this.state.question.answerOptions.map((answerOption) => (
								<button className={this.state.selected !== "" && answerOption.isCorrect ? "correct" : this.state.selected === answerOption.answerText ? "incorrect" : ""}
								onClick={() => this.setState({selected: answerOption.answerText})}>{answerOption.answerText}</button>
							))}
						</div>
				</div>
				<br></br>
				<button onClick={() => this.nextQuestion()}>Next</button>
			</div>


		)
	};
}

class Fact extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {fact: '', name: ''};
  
	  this.handleNameChange = this.handleNameChange.bind(this);
	  this.handleFactChange = this.handleFactChange.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);
	}
  
	handleFactChange(event) {
	  this.setState({fact: event.target.value});
	}
	handleNameChange(event) {
		this.setState({name: event.target.value});
	}
  
	handleSubmit(event) {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({fact: this.state.fact, owner: this.state.name})
		};
		fetch('https://still-dawn-36166.herokuapp.com/facts', requestOptions)
			.then(response => response.json())
			.then(data => alert("Ok!"));
		this.setState({fact: ''})
		event.preventDefault();
	}
  
	render() {
	  return (
		<div className='app'>
		<form onSubmit={this.handleSubmit}>
		  <div className="question-text">
			Tu nombre: <br></br>
			<input className="fact-form" type="text" value={this.state.name} onChange={this.handleNameChange} />
		  </div>
		  <div className="question-text">
			Contanos algo sobre vos! <br></br>
			<textarea className="fact-form" rows="4" cols="50" value={this.state.fact} onChange={this.handleFactChange} />
		  </div> <br></br>
		  <button type="submit">Send</button>
		</form>
		</div>
	  );
	}
  }

ReactDOM.render(
	<Router>
	  <div>
		<Route path="/quiz">
		  <Quiz />
		</Route>
		<Route path="/newFact">
		  <Fact />
		</Route>
	  </div>
	</Router>,
	document.getElementById("root")
  );