import React, { useEffect, useState } from "react"
import { Accordion, Icon } from "semantic-ui-react"
import SimNewWindow from '../simNewWindow';
import SigninCheck from '../../components/signin_check';

const SimulationActivity = ({ panelKey, content }) => {

  const [newSimWindowPopup, setNewSimWindowPopup] = useState([]);

  function openNewWindowPopup() {
    setNewSimWindowPopup([]);
    setNewSimWindowPopup([...newSimWindowPopup, panelKey]);
    // console.log(newSimWindowPopup);
  }

  const [activeIndex, setActiveIndex] = useState(-1);

  function handleClick(e, titleProps) {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index

    setActiveIndex(newIndex)
  }

  const [auth, setAuth] = useState("false")

  useEffect(() => {
    setAuth(localStorage.getItem("login"))
  }, [])

  return (
    <SigninCheck data={[
    <>
      <div style={{ width: "175px" }}>
      <Accordion styled className="simulation" defaultActiveIndex={-1} panels={[{
        key: { panelKey },
      }]}
      >
        <Accordion.Title onClick={openNewWindowPopup}>
          <Icon name='clone outline'/>
          Pop Up Simulation
        </Accordion.Title>
      </Accordion>
      {newSimWindowPopup.map((item, i) => (<SimNewWindow>{content}</SimNewWindow>))}

      </div>
      {/*<Divider/>*/}

      <Accordion styled className="simulation" defaultActiveIndex={-1} fluid panels={[{
        key: { panelKey },
      }]}
      >
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleClick}
        >
          <Icon name='dropdown'/>
          Expand Simulation
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          {/*<Button color="teal" onClick={openNewWindowExpand}>Pop Up Simulation</Button>*/}
          {/*{newSimWindowExpand.map((item, i) => (<SimNewWindow>{content}</SimNewWindow>))}*/}
          {content}
        </Accordion.Content>
      </Accordion>

    </>
    ]} auth={auth} content="simulator">
    </SigninCheck>

  )
}

export default SimulationActivity
