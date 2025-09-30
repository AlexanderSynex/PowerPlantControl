import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './styles.css'

import Modal from './Modal'
import PowerPlant from './PowerPlant'
import PlantDetail from './PlantDetail'


function AppTitle() {
  return <div className='element app-header'>
      <img src={reactLogo} className="App-logo" alt="logo" />
      <p>
        Зарядная станция
      </p>
  </div>
}

export default function App() {
  const [isDetailsOpen, setDetailsOpen] = useState(false)
  const [currentCell, setCurrentCell] = useState(null)
  const [reloadId, setReloadId] = useState(null);

  const openDetails = () => {setDetailsOpen(true)};
  const closeDetails = () => {setDetailsOpen(false)};

  return (
    <>
    <div className="App">
      <header>
        <AppTitle/>
      </header>
      <div className='App-body'>
        <PowerPlant
          onDisplayDetails={openDetails}
          setCellApiUrl={setCurrentCell}
          reloadId={reloadId}
        />
        <Modal 
          isOpen={isDetailsOpen}
          onClose={closeDetails}
          children={
            <PlantDetail
              url={currentCell}
              onClickClose={closeDetails}
              setReloadId={setReloadId}
            />
          }>
        </Modal>
      </div>
    </div>
    </>
  )
}
