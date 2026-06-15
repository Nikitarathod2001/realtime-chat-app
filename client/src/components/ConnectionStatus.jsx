import React from 'react'

const ConnectionStatus = ({connectionStatus}) => {

  const statusStyles = connectionStatus === "Connected" 
                        ? "bg-green-100 text-green-700 border-green-300"
                        : connectionStatus === "Disconnected"
                        ? "bg-red-100 text-red-700 border-red-300"
                        : "bg-yellow-100 text-yellow-700 border-yellow-300";

    const statusText = connectionStatus === "Connected"
                        ? "🟢 Connected"
                        : connectionStatus === "Disconnected"
                        ? "🔴 Disconnected"
                        : "🟡 Connecting..."

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${statusStyles}`}>
      {statusText}
    </div>
  )
}

export default ConnectionStatus
