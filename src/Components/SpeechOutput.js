import React from "react";
import { withRouter } from "react-router-dom"
import { Form, Col, Modal} from "react-bootstrap";

class SpeechOutput extends React.Component {
  state={
    voiceSpeed: 0.8,
    lang: 'en',
    selectedVoice: 'Alex',
    saveForm: false,
    description: "",
    newCategory: "",
  }
    
  renderVoice = (e) => {
    e.preventDefault()
    let text = e.target.translateText.value
    let voiceName = e.target.voice.value.split(' ')[0]
    let utterThis = new SpeechSynthesisUtterance()  
    let setVoice = this.props.voices.find(voice => voice.name === voiceName)

    this.setState({
      selectedVoice: voiceName
    })

    utterThis.rate = this.state.voiceSpeed
    utterThis.text = text
    utterThis.voice = setVoice
    speechSynthesis.speak(utterThis) 
  }

  renderSpeed = (e) => {
    this.setState({
      voiceSpeed: e.target.value
    })
  }

  renderChange = (e) => {
    this.props.renderChange(e.target.value)
  }

  renderOptions = () => {
    let synth = window.speechSynthesis
    let voices = synth.getVoices()

    let enVoices = voices.filter(voice => voice.lang.toLowerCase().includes('en'))
    let frVoices = voices.filter(voice => voice.lang.toLowerCase().includes('fr'))
    let esVoices = voices.filter(voice => voice.lang.toLowerCase().includes('es'))
    let itVoices = voices.filter(voice => voice.lang.toLowerCase().includes('it'))
    let deVoices = voices.filter(voice => voice.lang.toLowerCase().includes('de'))

    let voicesRender = enVoices.concat(frVoices).concat(esVoices).concat(itVoices).concat(deVoices)
    
    let index = 0
    return voicesRender.map(voice => <option key={index += 1}>{voice.name + ' (' + voice.lang + ')'}</option>) 
  }

  selectLang = (e) => {
    let langValue
    if(e.target.value === "English"){
      langValue = 'en'
    } else if(e.target.value === "French"){
      langValue = 'fr'
    }else if(e.target.value === "Spanish"){
      langValue = 'es'
    }else if(e.target.value === "German"){
      langValue = 'de'
    }else if(e.target.value === "Italian"){
      langValue = 'it'
    }
    this.setState({
      lang: langValue
    })

    this.props.handletranslationlan(langValue)
  }

  showSaveForm = (e) => {
    this.setState({
      saveForm: true
    })
  }

  renderCategories = () => {
    let index = 0
    return this.props.categories.map(category => <option key={index += 1}>{category.title}</option>)
  }

  renderSaveForm = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  saveMessage = (e) => {
    e.preventDefault()

    let text = this.props.translatedtext
    let language = this.state.lang
    let voice = this.state.selectedVoice
    let title

    if(e.target.newCategory.value === ""){
      title = e.target.existingCategory.value
    }else {
      title = e.target.newCategory.value
    }

    let category = {
      title: title,
    }

    let message = {
      description: e.target.description.value,
      language: language,
      voice: voice,
      content: text,
    }

    this.props.savemessage(category, message)
    this.props.history.push("/messages")
  }

  closeForm = () => {
    this.setState({
      saveForm: false
    })
  }

  render() {
    return (
      <div className="speechoutput">
         <Form onSubmit={this.renderVoice}>
          <Form.Row>

            <Form.Group as={Col} controlId="language.ControlSelect1">
              <Form.Label>Choose Language:</Form.Label>
              <Form.Control as="select" name="language" onChange={this.selectLang}>
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
                <option>German</option>
                <option>Italian</option>
              </Form.Control>
            </Form.Group>
             
            <Form.Group as={Col} controlId="voice.ControlSelect1">
              <Form.Label>Choose Voice:</Form.Label>
              <Form.Control as="select" name="voice">
                {this.renderOptions()}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="speed.ControlInput1">
              <Form.Label>Choose Speed:</Form.Label>
              <Form.Control type="number" name="voiceSpeed" min="0.5" max="2" step="0.1" value={this.state.voiceSpeed} onChange={this.renderSpeed}></Form.Control>
            </Form.Group>    
          </Form.Row>

          <Form.Group controlId="text.ControlInput2">
              <Form.Control style={{backgroundColor: "#DCDCDC	"}} readOnly size="lg" as="textarea" rows="8" placeholder="Translated text will appear here" name="translateText" value={this.props.translatedtext}/>
          </Form.Group>

          <Form.Row>

            <Form.Group controlId="button2">
              <button className="hearOutLoudButton" type="submit">Hear Out Loud</button>
            </Form.Group>

            <Form.Group controlId="button3">
              <button className="SaveButton" onClick={this.showSaveForm} variant="info" type="button">Save</button>
            </Form.Group>

          </Form.Row>                     
        </Form>

        {this.state.saveForm ?
        <>
          <Modal show={this.state.saveForm}
            {...this.props}
            centered
          >
            <Form className="SaveForm" onSubmit={this.saveMessage}>
              <Modal.Header closeButton onClick={this.closeForm}>
                <Modal.Title>Save Message</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Form.Row>
                  <Form.Group>
                    <Form.Label>Existing Category</Form.Label>
                    <Form.Control as="select" name="existingCategory">
                      {this.renderCategories()}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group> <span style={{marginLeft: "12px"}}>or</span></Form.Group>

                  <Form.Group>
                    <Form.Label style={{marginLeft: "10px"}}>Create Category</Form.Label>
                    <Form.Control style={{marginLeft: "10px"}} type="text" name="newCategory" onChange={this.renderSaveForm} value={this.state.newCategory}/>
                  </Form.Group>
                
                </Form.Row>
              
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" onChange={this.renderSaveForm} type="text" value={this.state.description}/>
              </Modal.Body>
              

              <Modal.Footer>
                <input className="ModalSaveButton" type="submit" value="submit"/>
              </Modal.Footer>

            </Form>
          </Modal>

        </>
   
         : null}
      </div>
    )
  }
}

export default withRouter(SpeechOutput);
