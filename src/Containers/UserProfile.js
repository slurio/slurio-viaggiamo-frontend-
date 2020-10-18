import React from 'react'
import UserAchievements from '../Components/UserAchievements'
import UserBio from '../Components/UserBio'
import styled from 'styled-components'

export default function UserProfile(props) {
    return(
      <Container>
        <UserBio currentUser={props.currentUser}/>
        <UserAchievements currentUser={props.currentUser}/>
      </Container>
    )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 40px;
  max-width: 100vw;
  @media (min-width: 768px) {
    flex-direction: row-reverse;
  }
  `