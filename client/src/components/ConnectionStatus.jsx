import React from 'react'

const ConnectionStatus = ({connectionStatus}) => {
  return (
    <p>
        {
          connectionStatus === "Connected"
          ? "🟢 Connected"
          : connectionStatus === "Disconnected"
          ? "🔴 Disconnected"
          : "🟡 Connecting..."
        }
      </p>
  )
}

export default ConnectionStatus
