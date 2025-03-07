import React from 'react'
import Sidebar from './Components/Sidebar'
import ChannelBar from './Components/ChannelBar'
import ChatBox from './Components/ChatBox'

const Home = () => {
  return (<>
   
        <div className="flex h-screen bg-gray-900 text-white">
       <Sidebar/>
    <ChannelBar/>
    <ChatBox/>
      
    </div>
    </>
  )
}

export default Home