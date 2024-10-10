import { Server as IOServer, Socket } from 'socket.io'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'

interface SocketWithIO extends HTTPServer {
  io?: IOServer
}

// Deshabilitar el prerenderizado estático
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const res = NextResponse.next()

  // Obtener el servidor HTTP del socket
  const socket = (req as unknown as { socket: NetSocket & { server: HTTPServer } }).socket
  const server = socket.server as SocketWithIO

  // Verificar si ya se ha inicializado una instancia de Socket.IO
  if (!server.io) {
    const io = new IOServer(server)

    io.on('connection', (socket: Socket) => {
      console.log('New connection established')

      // Evento para cuando un jugador se une a la sala
      socket.on('joinRoom', ({ roomToken, username }) => {
        socket.join(roomToken)
        io.to(roomToken).emit('playerJoined', username)
        console.log(`${username} has joined room: ${roomToken}`)
      })

      // Evento para cuando un jugador envía un mensaje de chat
      socket.on('chatMessage', ({ roomToken, message, username }) => {
        io.to(roomToken).emit('messageReceived', { username, message })
      })

      // Evento para cuando un jugador se va de la sala
      socket.on('leaveRoom', ({ roomToken, username }) => {
        socket.leave(roomToken)
        io.to(roomToken).emit('playerLeft', username)
        console.log(`${username} has left room: ${roomToken}`)
      })
    })

    server.io = io
  }

  return res
}
