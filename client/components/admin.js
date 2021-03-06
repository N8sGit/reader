import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {add} from '.././store/post.js'
import * as data from './checkboxConstants.js'
import Checkbox from './checkbox.js'
import Editor from './editor.js'
import AdminPostBar from './adminPostBar.js'

let checkboxEls = Object.keys(data).map(function (key) {
    return key;
 });

const initialState = {
    text: '',
    title: '',
    category: [],
    selectedId: '',
    selectedTitle: '',
    selected: {},
    selectedCategories: [],
    image: ''
}

class Admin extends React.Component{
    constructor(props){
        super(props)
        this.state = {...initialState}
    }

    componentDidMount = () => {
        axios.get('/get')
            .then(res => {
                this.setState({titles: [...res.data.info]})
            })
    }

    setSidebar = (item) => {
        this.setState({ selected: item, text: item.content,  selectedId: item.id, title: item.title})
    }

    componentWillMount = () => {
        this.selectedCheckboxes = new Set();
      }

    toggleCheckbox = label => {
        if (this.selectedCheckboxes.has(label)) {
          this.selectedCheckboxes.delete(label);
        } else {
          this.selectedCheckboxes.add(label);
        }
    }

    reset = () => {
        this.setState(initialState)
    }

    postCategories = (category) => {
        axios.post('/categories', {postId: this.state.selectedId, category: category})
    }

    handleFormSubmit = formSubmitEvent => {
       formSubmitEvent.preventDefault();

        for (const checkbox of this.selectedCheckboxes) {
            this.state.category.push(checkbox)
        }

        let categories = this.state.category

        for (let i = 0 ; i < categories.length; i++){
            this.postCategories(categories[i])
        }


    }
    createCheckbox = label => {
        let catSet = new Set(this.props.selectedCategories)
        let checkStatus;
        if (catSet.has(label)){
            checkStatus = true
        }
        else {
            checkStatus = false
            catSet.delete(label)
        }
        return (<Checkbox
                    label={label}
                    handleCheckboxChange={this.toggleCheckbox}
                    key={label}
                    boxStatus = {checkStatus}
                />
           )
     }

    createCheckboxes = () => (
        checkboxEls.map(this.createCheckbox)
    )


    onChangeText = (event) => {
            this.setState({text: event.target.value})
    }

    onChangeTitle = (event) => {
        this.setState({title: event.target.value})
    }

    onChangeImage = (event) => {
        this.setState({image: event.target.value})
    }


    render(){

        return (
<div id="admin-page">
    <div id="admin-large">
            <p> The currently selected post is: {this.state.title} </p>
        <form onSubmit={this.handleFormSubmit}>
              {this.createCheckboxes()}

              <button className="btn btn-default" type="submit" >Save</button>

              <button
                className="btn btn-default" type="submit" onClick={() => {
                  window.location.reload()
              }} > Clear
              </button>
        </form>

        <div className ="textFields">
            <form>
                <div id="textareas">
                <textarea
                    className="field input" onChange={this.onChangeTitle.bind(this)}
                    value={this.state.title} rows="1" cols="100" placeholder="title"
                />
                <textarea
                     className="field input" onChange={this.onChangeImage.bind(this)}
                    value={this.state.image} rows="1" cols="100" placeholder="insert url for title img"
                />
              </div>
                <Editor
                    className="field" placeholder={'Write here'} selectedId={this.state.selectedId}
                    title={this.state.title} text={this.state.text} image={this.state.image}
                />
            <div className="button-parent">
                <button
                    className="btn btn-default" type="button" onClick={ () => {this.reset()}
                    }>
                        Clear
                </button>
            </div>
            </form>
        </div>
    </div>
    <div id="admin-small">
            <div id="titleDisplay">
        { <AdminPostBar setSidebar = {this.setSidebar.bind(this)} />}
        </div>
    </div>
</div>
        )
    }
}
//This map state will have to be altered to reflect changes in the editor
const mapState = (state) => {
    return {
       text: state.post.text,
       title: state.post.title,
       image: state.post.image,
       selectedCategories: state.post.allCategories
    }
  }

const mapDispatch = (dispatch) => {
    return {
        add (text, title, image){
            dispatch(add(text, title, image))
        }
      }
    }
export default connect(mapState, mapDispatch)(Admin)

