import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import flagFR from '../images/french.png'
import flagGE from '../images/german.png'
import flagIT from '../images/italian.png'
import flagES from '../images/spanish.png'

export default function LessonLevel(props){
  let [currentLevel, setCurrentLevel] = useState(0)
  let [correctCount, setCorrectCount] = useState(0)
  let [disabledClass, setDisabledClass] = useState('')
  let [showContinue, setShowContinue] = useState(false)
  let [lessonOver, setLessonOver] = useState(false)
  let [answerColor, setAnswerColor] = useState('green')
  let [answerList, setAnswerList] = useState([])

  useEffect(()=>{
    setAnswerList(props.questionList[currentLevel].answer.split('|'))
  }, [props.questionList, currentLevel])

  function clickHandler(e){
    setDisabledClass('disabled')
    if(answerList.length === 4 && e.target.id !== answerList[3]){setAnswerColor('red')}else{setCorrectCount(correctCount + 1)}
    setShowContinue(true)
  }

  function resetQuestion() {
    setDisabledClass('')
    setShowContinue(false)
    setAnswerColor('green')
    if(currentLevel === 9){
      setLessonOver(true)
    }else{
      setCurrentLevel(currentLevel + 1)
    }
  }

  function checkAnswer(e){
    e.preventDefault()
    if(e.target.answer.value.replace(/[^0-9a-z]/gi, '').toLowerCase() !== answerList[0].replace(/[^0-9a-z]/gi, '').toLowerCase()){setAnswerColor('red')}else{setCorrectCount(correctCount + 1)}
    setShowContinue(true)
  }

  function getFlag(){
    switch(props.currentLang) {
      case 'Spanish':
        return flagES
      case 'French':
        return flagFR
      case 'German':
        return flagGE
      case 'Italian':
        return flagIT
      default:
        return 'error'
    }
  }

  function renderAnswer(){
    if(answerList.length === 1){
      return(
        <Form onSubmit={checkAnswer}>
          <input disabled={showContinue} name="answer"></input>
          {
            showContinue
            ? null
            : <Button>Submit</Button>
          }          
        </Form>
      )
    }else{
      return(
        <ul style={{padding: 0, margin: 0}} onClick={clickHandler}>
          <MultiAnswer className={disabledClass} id="1">{answerList[0]}</MultiAnswer>
          <MultiAnswer className={disabledClass} id="2">{answerList[1]}</MultiAnswer>
          <MultiAnswer className={disabledClass} id="3">{answerList[2]}</MultiAnswer>
        </ul>
      )
    }
  }


  return(
    <Container>
      <FlagImage src={getFlag()}/>
      {
        lessonOver
        ? 
        <>
        <h2>You got {correctCount} answers correct!</h2>
        <Question>That's all the learning we have for you!</Question>
        <Button onClick={props.resetLessons}>To Lessons</Button>
        </>
        :
        <>
        <Question>{props.questionList[currentLevel].question}</Question>
        <Hr />      
        {renderAnswer()}
        {
          showContinue
          ? <>
              <h4 style={{color: answerColor}}>{answerList.length === 4 ? answerList[parseInt(answerList[3]) - 1] : answerList[0]}</h4>
              <Button onClick={resetQuestion}>Continue</Button>
            </>
          : null
        }
        </>
      }
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  .disabled {
    pointer-events:none;
    opacity:0.6;
  }
  `

const Question = styled.h2`
  margin-bottom: 10px;
  `

const MultiAnswer = styled.li`
  list-style-type: none;
  margin: 10px;
  &:hover {
    cursor: pointer;
  }
  @media (max-width: 768px) {
    font-size: 25px;
  }
  `

const Button = styled.button`
  margin: 20px 40px;
  font-weight: bold;
  color: #A594F9;
  background-color: #333333;
  font-size: 20px;
  border: none;
  border-radius: 10px;
  padding: 6px 0;

  @media (max-width: 768px) {
    padding: 5px 10px;
  }

  &:hover {
    color: #272727;
    background-color: #A594F9;
    cursor: pointer;
  }
  `

const FlagImage = styled.img`
  max-height: 20vh;
  max-width: 20vw;
  height: auto;
  width: auto;
  margin-bottom: 10px;
  padding: 5px;
  `

const Hr = styled.hr`
  background-color: #A594F9;
  height: 2px;
  margin: 10px;
  width: 100%;
  `

const Form = styled.form`
  display: flex;
  flex-direction: column;
  `